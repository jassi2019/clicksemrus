"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight, ChevronDown, Plus, Minus } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { trackEvent } from "./Tracker";

const SERVICE_OPTIONS = [...SERVICES.map((s) => s.name), "Complete Digital Marketing"];
/** Chips shown before "+ more" is pressed. */
const PRIMARY = ["SEO Services", "Social Media Marketing", "Google Ads (PPC)", "Meta Ads (Facebook & Instagram)"];
const SECONDARY = SERVICE_OPTIONS.filter((n) => !PRIMARY.includes(n));

/** Split a single "Name" field: first word becomes firstName, the rest lastName. */
function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

export default function LeadForm({ compact = false, source = "" }: { compact?: boolean; source?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [moreServices, setMoreServices] = useState(false);
  const [details, setDetails] = useState(false);
  const path = usePathname();
  void compact;

  function toggle(name: string) {
    setServices((cur) => (cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Enter a 10-digit Indian mobile number.");
      return;
    }
    setError("");
    setState("loading");
    const { firstName, lastName } = splitName(String(fd.get("name") ?? ""));
    const body = {
      firstName,
      lastName,
      company: fd.get("company") ?? "",
      website: fd.get("website") ?? "",
      email: fd.get("email"),
      phone: `+91${digits}`,
      services,
      message: fd.get("message") ?? "",
      consent: fd.get("consent") === "on",
      hp: fd.get("hp"),
      source: "form",
      page: source || path,
      path,
    };
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Request failed");
      setState("done");
      trackEvent("lead_submitted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "done")
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 className="mx-auto text-lime" size={44} />
        <h3 className="font-display text-2xl font-bold mt-4">Thank you! We will call you within 2 hours.</h3>
        <p className="text-muted mt-2">Meanwhile, check our latest growth ideas on the blog.</p>
      </div>
    );

  const chips = moreServices ? SERVICE_OPTIONS : PRIMARY;

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      {/* honeypot */}
      <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-3">
        <input required name="name" placeholder="Your name" className="input" autoComplete="name" maxLength={120} aria-label="Your name" />
        <div className="flex input !p-0 overflow-hidden items-stretch">
          <span className="px-3 grid place-items-center text-sm font-semibold text-muted bg-surface-2 border-r border-border select-none shrink-0">IN +91</span>
          <input
            required
            name="phone"
            placeholder="98765 43210"
            className="flex-1 min-w-0 bg-transparent px-3 py-[.85rem] outline-none"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, "").slice(0, 11))}
            aria-label="Mobile number"
          />
        </div>
      </div>
      <input required name="email" placeholder="Work email" className="input" type="email" autoComplete="email" maxLength={120} aria-label="Email address" />

      <fieldset>
        <legend className="text-xs font-semibold text-muted mb-2">What do you need help with?</legend>
        <div className="flex flex-wrap gap-2">
          {chips.map((name) => {
            const on = services.includes(name);
            return (
              <button
                type="button"
                key={name}
                aria-pressed={on}
                onClick={() => toggle(name)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${on ? "bg-brand text-white border-brand" : "border-border bg-surface hover:bg-surface-2"}`}
              >
                {name}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreServices((v) => !v)}
            aria-expanded={moreServices}
            className="px-3 py-1.5 rounded-full text-xs font-bold border border-dashed border-border text-brand hover:bg-surface-2 inline-flex items-center gap-1"
          >
            {moreServices ? <><Minus size={12} /> Less</> : <><Plus size={12} /> {SECONDARY.length} more</>}
          </button>
        </div>
      </fieldset>

      <details className="group rounded-xl border border-border bg-surface-2/60 open:bg-surface" onToggle={(e) => setDetails((e.currentTarget as HTMLDetailsElement).open)}>
        <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          <span>Add details <span className="text-muted font-medium">(optional)</span></span>
          <ChevronDown size={16} className={`text-muted transition-transform ${details ? "rotate-180" : ""}`} />
        </summary>
        <div className="grid gap-3 px-4 pb-4 pt-1">
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="company" placeholder="Company / brand" className="input" autoComplete="organization" maxLength={100} />
            <input name="website" placeholder="Website" className="input" type="text" autoComplete="url" maxLength={200} inputMode="url" />
          </div>
          <textarea name="message" placeholder="Tell us about your goals, budget or timeline" className="input min-h-20" maxLength={2000} />
        </div>
      </details>

      <label className="flex gap-2.5 items-center text-xs text-muted">
        <input required name="consent" type="checkbox" className="accent-[#4f46e5] w-4 h-4" />
        <span>I agree to be contacted on email/WhatsApp.</span>
      </label>

      <button disabled={state === "loading"} className="btn btn-primary disabled:opacity-60 w-full sm:w-auto">
        {state === "loading" ? <Loader2 className="animate-spin" size={18} /> : <>Get My Free Growth Plan <ArrowRight size={18} /></>}
      </button>
      {error && <p className="text-accent text-sm" role="alert">{error}</p>}
      <p className="text-[11px] text-muted">No spam. Free audit, no obligation. We reply within 2 business hours.</p>
    </form>
  );
}
