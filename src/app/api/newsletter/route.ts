import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordEvent } from "@/lib/analytics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NEWSLETTER_KEY = "newsletter:emails";

/** Forward to Resend Audiences or Brevo when configured; otherwise storing in Redis is enough. */
async function forward(email: string) {
  if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
    await fetch(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ email, unsubscribed: false }),
    }).catch(() => {});
  }
  if (process.env.BREVO_API_KEY) {
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": process.env.BREVO_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({ email, updateEnabled: true, ...(process.env.BREVO_LIST_ID ? { listIds: [Number(process.env.BREVO_LIST_ID)] } : {}) }),
    }).catch(() => {});
  }
}

export async function POST(req: NextRequest) {
  try {
    const b = (await req.json()) as { email?: unknown };
    const email = typeof b.email === "string" ? b.email.trim().toLowerCase().slice(0, 120) : "";
    if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    await db.sadd(NEWSLETTER_KEY, email);
    await recordEvent("newsletter_signup");
    await forward(email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
