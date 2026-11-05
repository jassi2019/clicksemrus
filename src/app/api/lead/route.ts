import { NextRequest, NextResponse } from "next/server";
import { saveLead, type Lead } from "@/lib/posts";
import { recordEvent } from "@/lib/analytics";
import { SITE, SERVICES } from "@/lib/site";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ALLOWED_SERVICES = new Set([...SERVICES.map((s) => s.name), "Complete Digital Marketing"]);

/** Normalise an Indian number into E.164 (+91XXXXXXXXXX). Returns "" when invalid. */
function normalisePhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length !== 10 || !/^[6-9]/.test(d)) return "";
  return `+91${d}`;
}

export async function POST(req: NextRequest) {
  try {
    const b = (await req.json()) as Record<string, unknown>;
    if (str(b.hp, 10)) return NextResponse.json({ ok: true }); // honeypot

    // New form fields, with fallbacks for the legacy payload (name/phone/email/service)
    const firstName = str(b.firstName, 60);
    const lastName = str(b.lastName, 60);
    const name = (firstName || lastName ? `${firstName} ${lastName}`.trim() : str(b.name, 100));
    const email = str(b.email, 120);
    const phone = normalisePhone(str(b.phone, 20));
    const company = str(b.company, 100);
    const website = str(b.website, 200);
    const source = str(b.source, 40);
    const consent = b.consent === true || b.consent === "on" || source === "chat";
    const servicesRaw = Array.isArray(b.services) ? b.services : b.service ? [b.service] : [];
    const services = servicesRaw.map((s) => str(s, 80)).filter((s) => ALLOWED_SERVICES.has(s)).slice(0, 10);
    const message = str(b.message, 2000);

    if (!name) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    if (!phone) return NextResponse.json({ ok: false, error: "Please enter a valid 10-digit Indian mobile number." }, { status: 400 });
    if (!consent) return NextResponse.json({ ok: false, error: "Please agree to be contacted." }, { status: 400 });
    if (website && !/^https?:\/\/|^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(website)) return NextResponse.json({ ok: false, error: "Website looks invalid." }, { status: 400 });

    const lead: Lead = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      name,
      firstName,
      lastName,
      phone,
      email,
      company,
      website,
      services,
      service: services.join(", "),
      budget: str(b.budget, 60),
      message,
      consent,
      source: source || "form",
      page: str(b.page, 200),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    await saveLead(lead);
    await recordEvent("lead");

    // Optional email notification via Resend
    if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: `${SITE.name} <onboarding@resend.dev>`,
          to: [process.env.LEAD_NOTIFY_EMAIL],
          subject: `New lead: ${name} (${lead.service || "General"})`,
          text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nCompany: ${company}\nWebsite: ${website}\nServices: ${lead.service}\nBudget: ${lead.budget}\nSource: ${lead.source}\nPage: ${lead.page}\n\n${message}`,
        }),
      }).catch(() => {});
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
