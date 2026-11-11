"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X, ArrowRight, ArrowLeft, Zap, Target, ShoppingBag, Users, Search, Check, Loader2 } from "lucide-react";
import { trackEvent } from "./Tracker";
import { SITE } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppButton";

/**
 * Growth Score popup: a 3-question mini quiz that builds a live score while the
 * visitor answers, then asks for contact details and reveals the score.
 * Opens once per session after 18s, 45% scroll, or exit intent. Hidden on /admin and /contact.
 */

type Goal = { id: string; label: string; icon: React.ElementType; services: string[]; pts: number };
const GOALS: Goal[] = [
  { id: "leads", label: "More leads & calls", icon: Target, services: ["Google Ads (PPC)", "Meta Ads (Facebook & Instagram)"], pts: 22 },
  { id: "sales", label: "More online sales", icon: ShoppingBag, services: ["Meta Ads (Facebook & Instagram)", "Google Ads (PPC)"], pts: 24 },
  { id: "followers", label: "Instagram growth", icon: Users, services: ["Social Media Marketing"], pts: 18 },
  { id: "rank", label: "Rank on Google", icon: Search, services: ["SEO Services"], pts: 20 },
];
const BUDGETS = [
  { id: "u25", label: "Under ₹25k / mo", pts: 10 },
  { id: "25-75", label: "₹25k – 75k", pts: 18 },
  { id: "75-200", label: "₹75k – 2L", pts: 24 },
  { id: "200+", label: "₹2L+", pts: 28 },
];
const SITES = [
  { id: "good", label: "Yes, and it converts", pts: 26 },
  { id: "weak", label: "Yes, but it is weak", pts: 16 },
  { id: "none", label: "No website yet", pts: 8 },
];
const BASE = 12;
const KEY = "growth-popup-seen";

function wasSeen() { try { return Boolean(sessionStorage.getItem(KEY)); } catch { return false; } }
function markSeen() { try { sessionStorage.setItem(KEY, "1"); } catch {} }

export default function GrowthPopup() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number] | null>(null);
  const [site, setSite] = useState<(typeof SITES)[number] | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [shown, setShown] = useState(0);
  const firedRef = useRef(false);

  const score = useMemo(() => BASE + (goal?.pts ?? 0) + (budget?.pts ?? 0) + (site?.pts ?? 0), [goal, budget, site]);
  const blocked = !path || path.startsWith("/admin") || path.startsWith("/contact");

  // Triggers: time, scroll depth, exit intent. Once per session.
  useEffect(() => {
    if (blocked) return;
    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      markSeen();
      setOpen(true);
      trackEvent("growth_popup_open");
    };
    const t0 = setTimeout(() => { if (wasSeen()) { firedRef.current = true; setMinimised(true); } }, 0);
    const t = setTimeout(fire, 18000);
    const onScroll = () => {
      const h = document.documentElement;
      if (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) > 0.45) fire();
    };
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) fire(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      clearTimeout(t0); clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [blocked]);

  // Animate the score counter on the result step.
  useEffect(() => {
    if (step !== 4) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1200);
      setShown(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step, score]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setMinimised(true); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (blocked) return null;

  const close = () => { setOpen(false); setMinimised(true); };
  const reopen = () => { setOpen(true); setMinimised(false); trackEvent("growth_popup_reopen"); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const digits = phone.replace(/\D/g, "");
    if (!name.trim()) return setErr("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(digits)) return setErr("Enter a valid 10-digit mobile number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Enter a valid email.");
    setBusy(true);
    try {
      const [firstName, ...rest] = name.trim().split(/\s+/);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName: rest.join(" "),
          email,
          phone: `+91${digits}`,
          services: goal?.services ?? [],
          budget: budget?.label ?? "",
          message: `Growth Score quiz: goal=${goal?.label}; budget=${budget?.label}; website=${site?.label}; score=${score}`,
          consent: true,
          source: "growth-popup",
          path,
        }),
      });
      const j = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !j.ok) throw new Error(j.error || "Something went wrong.");
      trackEvent("growth_popup_lead");
      setStep(4);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const wa = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ClickSemrus! My growth score is ${score}/100. I want my 90-day plan for: ${goal?.label ?? "growth"}.`)}`;
  const dash = 2 * Math.PI * 44;
  const shownScore = step === 4 ? shown : score;

  return (
    <>
      {minimised && !open && (
        <button type="button" onClick={reopen} aria-label="Get my free growth score" className="gp-tab hidden md:block fixed left-4 bottom-20 md:bottom-5 z-40">
          <span className="gp-tab__glow" aria-hidden="true" />
          <span className="gp-tab__inner">
            <span className="gp-tab__icon"><Zap size={15} /></span>
            <span className="gp-tab__text">
              <span className="gp-tab__kicker">Free · 30 sec</span>
              <span className="gp-tab__label">Get my growth score</span>
            </span>
            <span className="gp-tab__arrow"><ArrowRight size={14} /></span>
          </span>
          <span className="gp-tab__badge" aria-hidden="true">New</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="gp-title">
          <div className="absolute inset-0 bg-[#0b0b14]/60 backdrop-blur-sm gp-fade" onClick={close} />
          <div className="gp-card relative w-full sm:max-w-[760px] bg-white text-[#0b0b14] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_40px_90px_-30px_rgba(11,11,20,.6)] grid sm:grid-cols-[260px_1fr] max-h-[92vh] sm:max-h-none overflow-y-auto">
            <button type="button" onClick={close} aria-label="Close" className="absolute top-3 right-3 z-10 grid place-items-center w-9 h-9 rounded-full bg-white/90 text-[#0b0b14] hover:bg-white shadow">
              <X size={18} />
            </button>

            {/* Score panel */}
            <aside className="section-dark relative p-5 sm:p-7 flex sm:flex-col items-center sm:items-start gap-5 sm:gap-6 overflow-hidden">
              <div className="absolute inset-0 dots opacity-60" />
              <div className="blob w-56 h-56 bg-[#4f46e5] -left-20 -bottom-20" />
              <div className="relative shrink-0">
                <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-36 sm:h-36 -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="44" fill="none" stroke="url(#gp-grad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={dash} strokeDashoffset={dash * (1 - shownScore / 100)}
                    className="transition-[stroke-dashoffset] duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="gp-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f59e0b" /><stop offset="1" stopColor="#4f46e5" /></linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <p className="font-display text-2xl sm:text-4xl font-extrabold leading-none">{shownScore}</p>
                    <p className="text-[10px] sm:text-xs text-muted font-bold tracking-widest mt-1">/ 100</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <p className="eyebrow !border-white/20 !bg-white/10 !text-white"><Zap size={11} /> Growth score</p>
                <p className="text-sm text-muted mt-3 leading-relaxed hidden sm:block">
                  {step < 3 ? "Your score builds as you answer. Three taps, no typing." : step === 3 ? "Last step. Tell us where to send your 90-day plan." : "Here is your score. Our team will send the plan within one business day."}
                </p>
                <ul className="hidden sm:grid gap-2 mt-5 text-xs font-semibold">
                  {[["Goal", goal?.label], ["Budget", budget?.label], ["Website", site?.label]].map(([k, v]) => (
                    <li key={k} className={`flex items-center gap-2 ${v ? "text-white" : "text-muted"}`}>
                      <span className={`grid place-items-center w-4 h-4 rounded-full ${v ? "bg-lime text-white" : "border border-white/30"}`}>{v && <Check size={10} />}</span>
                      {k}{v ? `: ${v}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Steps */}
            <div className="p-5 sm:p-8 sm:min-h-[400px] flex flex-col">
              {step < 4 && (
                <div className="flex items-center gap-2 mb-5">
                  {[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? "w-8 bg-brand" : "w-4 bg-border"}`} />)}
                  <span className="ml-auto text-xs font-bold text-muted">{step + 1} / 4</span>
                </div>
              )}

              {step === 0 && (
                <Step title="What do you want to grow first?" sub="Pick one. You can add more later.">
                  <div className="grid grid-cols-2 gap-3">
                    {GOALS.map((g) => (
                      <button
                        key={g.id} type="button" onClick={() => { setGoal(g); setStep(1); }}
                        className={`gp-opt group text-left rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_18px_40px_-24px_rgba(79,70,229,.5)] ${goal?.id === g.id ? "border-brand bg-brand/5" : "border-border bg-surface"}`}
                      >
                        <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#0b0b14] text-white group-hover:bg-brand transition"><g.icon size={18} /></span>
                        <p className="font-bold mt-3 text-sm">{g.label}</p>
                        <p className="text-[11px] text-muted mt-0.5">+{g.pts} pts</p>
                      </button>
                    ))}
                  </div>
                </Step>
              )}

              {step === 1 && (
                <Step title="Monthly marketing budget?" sub="Ad spend plus agency fee. A rough range is fine." onBack={() => setStep(0)}>
                  <div className="grid gap-2.5">
                    {BUDGETS.map((b) => (
                      <button
                        key={b.id} type="button" onClick={() => { setBudget(b); setStep(2); }}
                        className={`gp-opt flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left font-semibold text-sm transition hover:border-brand hover:bg-brand/5 ${budget?.id === b.id ? "border-brand bg-brand/5" : "border-border bg-surface"}`}
                      >
                        {b.label}<span className="text-[11px] text-muted font-bold">+{b.pts}</span>
                      </button>
                    ))}
                  </div>
                </Step>
              )}

              {step === 2 && (
                <Step title="Do you have a website?" sub="This decides whether we start with ads or a landing page." onBack={() => setStep(1)}>
                  <div className="grid gap-2.5">
                    {SITES.map((s) => (
                      <button
                        key={s.id} type="button" onClick={() => { setSite(s); setStep(3); }}
                        className={`gp-opt flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left font-semibold text-sm transition hover:border-brand hover:bg-brand/5 ${site?.id === s.id ? "border-brand bg-brand/5" : "border-border bg-surface"}`}
                      >
                        {s.label}<span className="text-[11px] text-muted font-bold">+{s.pts}</span>
                      </button>
                    ))}
                  </div>
                </Step>
              )}

              {step === 3 && (
                <Step title={`Your score is ready: ${score}/100`} sub="Where should we send your free 90-day growth plan?" onBack={() => setStep(2)}>
                  <form onSubmit={submit} className="grid gap-3">
                    <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                    <div className="flex gap-2">
                      <span className="input w-auto px-3 grid place-items-center font-bold text-sm bg-surface-2 select-none">+91</span>
                      <input className="input" placeholder="10-digit mobile" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} autoComplete="tel-national" required />
                    </div>
                    <input className="input" type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                    {err && <p className="text-sm text-red-600 font-medium">{err}</p>}
                    <button type="submit" disabled={busy} className="btn btn-accent mt-1 disabled:opacity-60">
                      {busy ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />} Reveal my score & plan
                    </button>
                    <p className="text-[11px] text-muted text-center">By continuing you agree to be contacted on WhatsApp or email. No spam, ever.</p>
                  </form>
                </Step>
              )}

              {step === 4 && (
                <div className="gp-step flex-1 flex flex-col justify-center text-center py-4">
                  <span className="mx-auto grid place-items-center w-14 h-14 rounded-full bg-lime text-white"><Check size={26} /></span>
                  <h3 id="gp-title" className="font-display text-2xl sm:text-3xl font-extrabold mt-5">
                    {score >= 70 ? "Strong foundation. Let us scale it." : score >= 45 ? "Good start. Big upside ahead." : "Lots of room to grow."}
                  </h3>
                  <p className="text-muted mt-3 text-sm leading-relaxed max-w-sm mx-auto">
                    Thanks {name.split(" ")[0]}. Your 90-day plan for <strong className="text-fg">{goal?.label.toLowerCase()}</strong> is on its way. Want it faster? Ping us on WhatsApp and we start today.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center mt-6">
                    <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click")} className="btn text-white bg-[#25D366] hover:brightness-95"><WhatsAppIcon size={18} /> WhatsApp us now</a>
                    <button type="button" onClick={close} className="btn btn-ghost">Done <ArrowRight size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Step({ title, sub, onBack, children }: { title: string; sub: string; onBack?: () => void; children: React.ReactNode }) {
  return (
    <div className="gp-step flex-1 flex flex-col">
      <div className="flex items-start gap-3">
        {onBack && (
          <button type="button" onClick={onBack} aria-label="Back" className="mt-1 grid place-items-center w-8 h-8 rounded-full hover:bg-surface-2 text-muted"><ArrowLeft size={16} /></button>
        )}
        <div>
          <h3 id="gp-title" className="font-display text-xl sm:text-2xl font-extrabold leading-tight">{title}</h3>
          <p className="text-sm text-muted mt-1">{sub}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
