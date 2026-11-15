"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Globe, Search, Megaphone, MessageCircle, Store, TrendingUp, Phone, ShoppingBag, Star, Check } from "lucide-react";
import InstagramIcon from "./InstagramIcon";
import { HERO_DEFAULT, type HeroContent } from "./HeroStatic";

/**
 * Growth-story hero: a fresh business starts from zero; ClickSemrus plugs in its modules one by one
 * (website, SEO, ads, social, WhatsApp) and the dashboard climbs. Pure CSS/SVG + a small timer, no WebGL.
 * Loops every ~16s, pauses on hover, renders the final state under prefers-reduced-motion.
 */

const MODULES = [
  { key: "web", label: "Website", icon: Globe, at: 1 },
  { key: "seo", label: "Local SEO", icon: Search, at: 2 },
  { key: "ads", label: "Google & Meta Ads", icon: Megaphone, at: 3 },
  { key: "social", label: "Instagram", icon: InstagramIcon, at: 4 },
  { key: "wa", label: "WhatsApp", icon: MessageCircle, at: 5 },
] as const;

const STAGES = [
  { label: "Day 0", title: "A fresh business. No website, no leads.", leads: 0, revenue: 0, followers: 0 },
  { label: "Week 1", title: "Website live. Tracking on. Google Business Profile set.", leads: 3, revenue: 0.2, followers: 40 },
  { label: "Week 2", title: "Local SEO starts ranking the clinic on Maps.", leads: 12, revenue: 0.9, followers: 180 },
  { label: "Month 1", title: "Google & Meta Ads bring the first paid leads.", leads: 48, revenue: 3.6, followers: 620 },
  { label: "Month 2", title: "Reels and social proof turn visitors into followers.", leads: 96, revenue: 7.8, followers: 2400 },
  { label: "Month 3", title: "WhatsApp automation closes faster. Growth compounds.", leads: 180, revenue: 15.4, followers: 5200 },
] as const;

const TOASTS = [
  { icon: Phone, text: "New call from Google Maps", sub: "Local SEO", at: 2 },
  { icon: ShoppingBag, text: "Order #1042 via Instagram", sub: "Meta Ads", at: 3 },
  { icon: Star, text: "New 5-star Google review", sub: "Review flow", at: 4 },
  { icon: MessageCircle, text: "WhatsApp enquiry replied in 40s", sub: "Automation", at: 5 },
] as const;

const STEP_MS = 2600;
const PATH = "M0,150 C40,148 60,146 90,142 S150,128 190,112 S250,78 300,52 S350,28 400,10";

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n));
}

export default function GrowthStoryHero({ hero = HERO_DEFAULT }: { hero?: HeroContent }) {
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) { setStage(STAGES.length - 1); return; }
    let i = 0;
    const id = setInterval(() => {
      if (paused) return;
      i = (i + 1) % (STAGES.length + 1); // one extra beat on the final frame
      setStage(Math.min(i, STAGES.length - 1));
    }, STEP_MS);
    return () => clearInterval(id);
  }, [paused]);

  const s = STAGES[stage];
  const progress = stage / (STAGES.length - 1);
  const dash = useMemo(() => ({ strokeDasharray: 520, strokeDashoffset: 520 * (1 - progress) }), [progress]);

  return (
    <section className="relative overflow-hidden -mt-20 pt-28 pb-14 md:pt-40 md:pb-24 min-h-[92svh] flex items-center">
      <div className="absolute inset-0 dots" aria-hidden="true" />
      <div className="hero-blob hero-blob-a" aria-hidden="true" />
      <div className="hero-blob hero-blob-b" aria-hidden="true" />

      <div className="container-x relative grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-14 items-center">
        {/* copy */}
        <div className="max-w-2xl">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1] mt-5">
            {hero.headline}<br /><span className="gradient-text">{hero.headlineAccent}</span>
          </h1>
          <p className="text-muted text-base md:text-xl mt-5 md:mt-6 leading-relaxed">{hero.sub}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-7 md:mt-8">
            <Link href="/contact" className="btn btn-primary text-base !px-7 !py-4">{hero.primaryCta} <ArrowRight size={18} /></Link>
            <Link href="/case-studies" className="btn btn-ghost text-base !px-7 !py-4">{hero.secondaryCta}</Link>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted">
            {["Zero to launch in 7 days", "Every channel, one team", "Reports in rupees"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-[#0b0b14] text-white grid place-items-center"><Check size={11} /></span>{t}</li>
            ))}
          </ul>
        </div>

        {/* story board */}
        <div className="gs relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-label="How a new business grows with ClickSemrus">
          {/* timeline */}
          <div className="flex items-center gap-1.5 mb-4" role="list" aria-label="Timeline">
            {STAGES.map((st, i) => (
              <button key={st.label} type="button" onClick={() => setStage(i)} className={`gs-step ${i <= stage ? "is-on" : ""} ${i === stage ? "is-now" : ""}`} aria-current={i === stage} aria-label={st.label}>
                <span className="gs-step__dot" /><span className="gs-step__label">{st.label}</span>
              </button>
            ))}
          </div>

          <div className="gs-card card !transform-none p-4 sm:p-5 relative overflow-hidden">
            {/* header: business + modules */}
            <div className="flex items-start gap-3">
              <div className={`gs-shop ${stage === 0 ? "is-empty" : ""}`}>
                <Store size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold tracking-widest text-brand uppercase">{s.label}</p>
                <p key={stage} className="gs-title font-display font-bold text-base sm:text-lg leading-snug mt-0.5">{s.title}</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-lime/15 text-[#166534]"><span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" /> Live plan</span>
            </div>

            {/* modules */}
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="ClickSemrus modules">
              {MODULES.map((m, i) => {
                const on = stage >= m.at;
                return (
                  <li key={m.key} className={`gs-mod ${on ? "is-on" : ""}`} style={{ transitionDelay: `${i * 60}ms` }}>
                    <m.icon size={14} /> {m.label}
                    {on && <Check size={12} className="gs-mod__check" />}
                  </li>
                );
              })}
            </ul>

            {/* chart + stats */}
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-3 items-end">
              <div className="relative h-36 sm:h-40 rounded-2xl bg-[#0b0b14] overflow-hidden">
                <div className="absolute inset-0 dots opacity-40" />
                <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="gs-line" x1="0" x2="1"><stop offset="0" stopColor="#8b84ff" /><stop offset="1" stopColor="#f59e0b" /></linearGradient>
                    <linearGradient id="gs-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f46e5" stopOpacity=".45" /><stop offset="1" stopColor="#4f46e5" stopOpacity="0" /></linearGradient>
                    <clipPath id="gs-clip"><rect x="0" y="0" width={400 * progress} height="160" /></clipPath>
                  </defs>
                  <path d={`${PATH} L400,160 L0,160 Z`} fill="url(#gs-fill)" clipPath="url(#gs-clip)" className="gs-fill" />
                  <path d={PATH} fill="none" stroke="url(#gs-line)" strokeWidth="3.5" strokeLinecap="round" style={dash} className="gs-line" />
                </svg>
                <div className="absolute left-3 top-3 text-[10px] font-bold tracking-widest text-white/60 uppercase inline-flex items-center gap-1"><TrendingUp size={12} /> Revenue / month</div>
                <div className="absolute right-3 top-3 font-display text-2xl sm:text-3xl font-extrabold text-white tabular-nums">₹{s.revenue.toFixed(1)}L</div>
                {stage === 0 && <p className="absolute inset-x-3 bottom-3 text-xs text-white/60">No traffic yet. This is where most businesses start.</p>}
              </div>
              <div className="grid gap-2 w-[108px] sm:w-[124px]">
                <Stat label="Leads / mo" value={fmt(s.leads)} />
                <Stat label="Followers" value={fmt(s.followers)} />
                <Stat label="Rank on Maps" value={stage >= 2 ? (stage >= 4 ? "#1" : "#3") : "—"} />
              </div>
            </div>

            {/* toasts */}
            <div className="absolute right-3 sm:right-4 top-14 sm:top-16 flex flex-col items-end gap-2 pointer-events-none" aria-live="polite">
              {TOASTS.filter((t) => t.at === stage).map((t) => (
                <div key={t.text} className="gs-toast">
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-[#0b0b14] text-white"><t.icon size={13} /></span>
                  <span className="leading-tight"><span className="block text-xs font-bold">{t.text}</span><span className="block text-[10px] text-muted">{t.sub}</span></span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-3 text-xs text-muted text-center">Illustrative 90-day journey. Your numbers depend on category and budget.</p>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2">
      <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{label}</p>
      <p className="font-display text-lg sm:text-xl font-extrabold tabular-nums leading-tight">{value}</p>
    </div>
  );
}
