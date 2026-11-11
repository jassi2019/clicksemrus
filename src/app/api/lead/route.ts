import { NextRequest, NextResponse } from "next/server";
import { saveLead, getSettings, type Lead } from "@/lib/posts";
import { recordEvent } from "@/lib/analytics";
import { SITE, SERVICES } from "@/lib/site";
import { attachLeadToVisitor, isValidVid } from "@/lib/visitors";
import { sendWhatsApp, digits, whatsappProvider } from "@/lib/whatsapp";

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

const istTime = (iso: string) => new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + " IST";

/** Compact owner alert. WhatsApp auto-links phone numbers, so the raw +91 number is tap-to-call. */
function ownerMessage(l: Lead): string {
  const lines = [
    `New lead on ${SITE.name}`,
    `Name: ${l.name}`,
    `Phone: ${l.phone}`,
    `Email: ${l.email}`,
    l.service ? `Services: ${l.service}` : "",
    l.budget ? `Budget: ${l.budget}` : "",
    l.company ? `Company: ${l.company}` : "",
    l.website ? `Website: ${l.website}` : "",
    `Source: ${l.source}${l.page ? ` (${l.page})` : ""}`,
    `Time: ${istTime(l.createdAt)}`,
    l.message ? `Message: ${l.message.slice(0, 300)}` : "",
    `Reply on WhatsApp: https://wa.me/${digits(l.phone)}`,
    `All leads: ${SITE.url}/admin/leads`,
  ];
  return lines.filter(Boolean).join("\n");
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

    const vidRaw = req.cookies.get("cs_vid")?.value || b.vid;
    const vid = isValidVid(vidRaw) ? vidRaw : undefined;
    const lead: Lead = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      vid,
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
    const settings = await getSettings().catch(() => ({}) as Awaited<ReturnType<typeof getSettings>>);
    await Promise.all([recordEvent("lead"), vid ? attachLeadToVisitor(vid, name).catch(() => {}) : Promise.resolve()]);

    // Numbers: the business number leads chat with, and the owner number that receives alerts.
    const businessNumber = digits(settings.whatsapp) || digits(SITE.whatsapp);
    const ownerNumber = digits(settings.ownerWhatsapp) || digits(process.env.OWNER_WHATSAPP) || businessNumber;
    const first = firstName || name.split(/\s+/)[0] || "there";

    // Response is prepared first; notifications are awaited below so Vercel does not kill them mid-flight.
    const res = NextResponse.json({ ok: true, whatsapp: businessNumber, firstName: first });

    const jobs: Promise<unknown>[] = [];

    // (i) Owner alert on WhatsApp
    if (ownerNumber && !ownerNumber.includes("0000000000")) {
      jobs.push(sendWhatsApp({ to: ownerNumber, text: ownerMessage(lead), kind: "owner-alert" }));
    }

    // (ii) Thank-you to the lead. Template (works any time) when configured on the Cloud API; otherwise plain text,
    // which the Cloud API only delivers inside a 24h window after the lead has messaged the business.
    if (whatsappProvider() === "cloud") {
      const tpl = process.env.WA_THANKYOU_TEMPLATE;
      const text = `Hi ${first}, thanks for contacting ${SITE.name}! A strategist will call you within 2 business hours. Meanwhile reply here with your website and goals.`;
      jobs.push(sendWhatsApp({ to: phone, text, template: tpl ? { name: tpl, params: [first, SITE.name], lang: process.env.WA_TEMPLATE_LANG || "en" } : undefined, kind: "lead-thankyou" }));
    }

    // Optional email notification via Resend
    if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL) {
      jobs.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
          body: JSON.stringify({
            from: `${SITE.name} <onboarding@resend.dev>`,
            to: [process.env.LEAD_NOTIFY_EMAIL],
            subject: `New lead: ${name} (${lead.service || "General"})`,
            text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nCompany: ${company}\nWebsite: ${website}\nServices: ${lead.service}\nBudget: ${lead.budget}\nSource: ${lead.source}\nPage: ${lead.page}\n\n${message}`,
          }),
          signal: AbortSignal.timeout(8000),
        }).catch(() => {}),
      );
    }

    await Promise.allSettled(jobs);
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
