"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { trackEvent } from "./Tracker";

export default function LeadForm({ compact = false, source = "" }: { compact?: boolean; source?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const path = usePathname();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, page: source || path }) });
      if (!res.ok) throw new Error();
      setState("done");
      trackEvent("lead_submitted");
    } catch {
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

  return (
    <form onSubmit={onSubmit} className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input required name="name" placeholder="Your name" className="input" autoComplete="name" />
      <input required name="phone" placeholder="Phone / WhatsApp number" className="input" type="tel" autoComplete="tel" pattern="[0-9+ ]{10,15}" />
      <input required name="email" placeholder="Email address" className="input" type="email" autoComplete="email" />
      <select name="service" className="input" defaultValue="">
        <option value="" disabled>Service you need</option>
        {SERVICES.map((s) => (
          <option key={s.slug} value={s.name}>{s.name}</option>
        ))}
        <option value="Complete Digital Marketing">Complete Digital Marketing</option>
      </select>
      <select name="budget" className="input" defaultValue="">
        <option value="" disabled>Monthly budget</option>
        <option>Under Rs 25,000</option>
        <option>Rs 25,000 to 50,000</option>
        <option>Rs 50,000 to 1,00,000</option>
        <option>Rs 1,00,000 to 3,00,000</option>
        <option>Above Rs 3,00,000</option>
      </select>
      {!compact && <input name="company" placeholder="Business / website (optional)" className="input" />}
      <textarea name="message" placeholder="Tell us about your goals" className={`input min-h-24 ${compact ? "" : "sm:col-span-2"}`} />
      <button disabled={state === "loading"} className={`btn btn-primary ${compact ? "" : "sm:col-span-2"} disabled:opacity-60`}>
        {state === "loading" ? <Loader2 className="animate-spin" size={18} /> : <>Get My Free Growth Plan <ArrowRight size={18} /></>}
      </button>
      {state === "error" && <p className="text-accent text-sm sm:col-span-2">Something went wrong. Please WhatsApp us instead.</p>}
      <p className={`text-xs text-muted ${compact ? "" : "sm:col-span-2"}`}>No spam. Free audit, no obligation. We reply within 2 business hours.</p>
    </form>
  );
}
