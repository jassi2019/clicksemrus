"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { trackEvent } from "./Tracker";

const SERVICE_OPTIONS = [...SERVICES.map((s) => s.name), "Complete Digital Marketing"];

export default function LeadForm({ compact = false, source = "" }: { compact?: boolean; source?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const path = usePathname();

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
    const body = {
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      company: fd.get("company"),
      website: fd.get("website"),
      email: fd.get("email"),
      phone: `+91${digits}`,
      services,
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      hp: fd.get("hp"),
      page: source || path,
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

  const full = compact ? "" : "sm:col-span-2";

  return (
    <form onSubmit={onSubmit} className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
      {/* honeypot */}
      <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input required name="firstName" placeholder="First name" className="input" autoComplete="given-name" maxLength={60} />
      <input required name="lastName" placeholder="Last name" className="input" autoComplete="family-name" maxLength={60} />
      <input required name="company" placeholder="Company / brand" className="input" autoComplete="organization" maxLength={100} />
      <input name="website" placeholder="Website (optional)" className="input" type="url" autoComplete="url" maxLength={200} inputMode="url" />
      <input required name="email" placeholder="Email address" className="input" type="email" autoComplete="email" maxLength={120} />
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
      <fieldset className={full}>
        <legend className="text-sm font-semibold mb-2">What do you need help with?</legend>
        <div className="flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map((name) => {
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
        </div>
      </fieldset>
      <textarea name="message" placeholder="Tell us about your goals" className={`input min-h-24 ${full}`} maxLength={2000} />
      <label className={`flex gap-3 items-start text-xs text-muted ${full}`}>
        <input required name="consent" type="checkbox" className="mt-0.5 accent-[#4f46e5]" />
        <span>I agree to be contacted by ClickSemrus on email/WhatsApp about my enquiry.</span>
      </label>
      <button disabled={state === "loading"} className={`btn btn-primary ${full} disabled:opacity-60`}>
        {state === "loading" ? <Loader2 className="animate-spin" size={18} /> : <>Get My Free Growth Plan <ArrowRight size={18} /></>}
      </button>
      {error && <p className={`text-accent text-sm ${full}`} role="alert">{error}</p>}
      <p className={`text-xs text-muted ${full}`}>No spam. Free audit, no obligation. We reply within 2 business hours.</p>
    </form>
  );
}
