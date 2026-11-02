import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/posts";
import { recordEvent } from "@/lib/analytics";
import { SITE } from "@/lib/site";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (b.website) return NextResponse.json({ ok: true }); // honeypot
    const name = String(b.name || "").trim().slice(0, 100);
    const phone = String(b.phone || "").trim().slice(0, 20);
    const email = String(b.email || "").trim().slice(0, 120);
    if (!name || !phone || !email) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    const lead = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      name,
      phone,
      email,
      service: String(b.service || "").slice(0, 80),
      budget: String(b.budget || "").slice(0, 60),
      message: [b.company ? `Company: ${b.company}` : "", String(b.message || "")].filter(Boolean).join("\n").slice(0, 2000),
      page: String(b.page || "").slice(0, 200),
      createdAt: new Date().toISOString(),
      status: "new" as const,
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
          text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${lead.service}\nBudget: ${lead.budget}\nPage: ${lead.page}\n\n${lead.message}`,
        }),
      }).catch(() => {});
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
