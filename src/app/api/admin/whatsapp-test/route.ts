import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { digits, sendWhatsApp, whatsappStatus } from "@/lib/whatsapp";

export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const settings = await getSettings().catch(() => ({}) as Awaited<ReturnType<typeof getSettings>>);
  const to = digits(settings.ownerWhatsapp) || digits(process.env.OWNER_WHATSAPP) || digits(settings.whatsapp) || digits(SITE.whatsapp);
  const status = whatsappStatus();
  if (status.provider === "none") return NextResponse.json({ ok: false, error: "WhatsApp is not configured. " + status.detail, to: `+${to}` });
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" });
  const result = await sendWhatsApp({ to, text: `Test from ${SITE.name} admin at ${time} IST. Lead alerts will arrive on this number.`, kind: "test" });
  return NextResponse.json({ ok: result.ok, provider: result.provider, error: result.reason, to: `+${to}` });
}
