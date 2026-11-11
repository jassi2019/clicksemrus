import { db } from "./db";

/**
 * Provider-agnostic WhatsApp sender. Picks, in order of availability:
 *  (a) Meta WhatsApp Cloud API  - WA_CLOUD_TOKEN + WA_PHONE_NUMBER_ID (text and template messages, any recipient)
 *  (b) CallMeBot                - CALLMEBOT_APIKEY + CALLMEBOT_PHONE (free, can only message the owner's own number)
 *  (c) none                     - returns { ok: false, reason: "not configured" }
 * Never throws. Every attempt is logged to the Redis list `wa:log` (last 200).
 *
 * Cloud API note: free-form text can only be delivered inside a 24h customer-service window (the recipient
 * must have messaged the business first). Outside that window use an approved template (WA_THANKYOU_TEMPLATE).
 */
export type WaProvider = "cloud" | "callmebot" | "none";

export type WaTemplate = { name: string; params: string[]; lang?: string };

export type WaResult = { ok: boolean; provider: WaProvider; reason?: string; id?: string };

export type WaLogEntry = {
  at: string;
  to: string;
  /** What the message was for, e.g. "owner-alert", "lead-thankyou", "test". */
  kind: string;
  provider: WaProvider;
  ok: boolean;
  reason?: string;
  preview: string;
};

const LOG = "wa:log";
export const digits = (v: string | undefined | null) => (v || "").replace(/\D/g, "");

export function whatsappProvider(): WaProvider {
  if (process.env.WA_CLOUD_TOKEN && process.env.WA_PHONE_NUMBER_ID) return "cloud";
  if (process.env.CALLMEBOT_APIKEY && process.env.CALLMEBOT_PHONE) return "callmebot";
  return "none";
}

/** Human-readable, secret-free description of the active setup for the admin. */
export function whatsappStatus(): { provider: WaProvider; label: string; detail: string; thankYouTemplate: string } {
  const provider = whatsappProvider();
  const tpl = process.env.WA_THANKYOU_TEMPLATE || "";
  if (provider === "cloud") {
    const id = process.env.WA_PHONE_NUMBER_ID || "";
    return { provider, label: "Meta WhatsApp Cloud API", detail: `Phone number id ending ${id.slice(-4)}. Owner alerts and lead thank-you messages are sent from your business number.`, thankYouTemplate: tpl };
  }
  if (provider === "callmebot") {
    return { provider, label: "CallMeBot (owner only)", detail: `Alerts go to +${digits(process.env.CALLMEBOT_PHONE)}. CallMeBot cannot message leads, so the thank-you WhatsApp is skipped until the Cloud API is configured.`, thankYouTemplate: tpl };
  }
  return { provider, label: "Not configured", detail: "Set WA_CLOUD_TOKEN + WA_PHONE_NUMBER_ID (Meta Cloud API) or CALLMEBOT_APIKEY + CALLMEBOT_PHONE (free owner alerts) in Vercel.", thankYouTemplate: tpl };
}

async function log(entry: WaLogEntry) {
  try {
    await db.lpush(LOG, entry);
    await db.ltrim(LOG, 0, 199);
  } catch {}
}

export async function listWaLog(n = 20): Promise<WaLogEntry[]> {
  try {
    return await db.lrange<WaLogEntry>(LOG, 0, n - 1);
  } catch {
    return [];
  }
}

async function sendCloud(to: string, text: string, template?: WaTemplate): Promise<WaResult> {
  const token = process.env.WA_CLOUD_TOKEN!;
  const phoneId = process.env.WA_PHONE_NUMBER_ID!;
  const version = process.env.WA_CLOUD_VERSION || "v21.0";
  const payload = template
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: { name: template.name, language: { code: template.lang || "en" }, components: template.params.length ? [{ type: "body", parameters: template.params.map((p) => ({ type: "text", text: p })) }] : [] },
      }
    : { messaging_product: "whatsapp", to, type: "text", text: { body: text, preview_url: false } };
  try {
    const res = await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    const j = (await res.json().catch(() => ({}))) as { messages?: { id: string }[]; error?: { message?: string; code?: number } };
    if (!res.ok) return { ok: false, provider: "cloud", reason: j.error?.message ? `${j.error.code ?? res.status}: ${j.error.message}` : `HTTP ${res.status}` };
    return { ok: true, provider: "cloud", id: j.messages?.[0]?.id };
  } catch (e) {
    return { ok: false, provider: "cloud", reason: e instanceof Error ? e.message : "network error" };
  }
}

async function sendCallMeBot(to: string, text: string): Promise<WaResult> {
  const owner = digits(process.env.CALLMEBOT_PHONE);
  if (to !== owner) return { ok: false, provider: "callmebot", reason: "CallMeBot can only message the owner's own number" };
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent("+" + owner)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(process.env.CALLMEBOT_APIKEY!)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const body = await res.text().catch(() => "");
    if (!res.ok || /error|invalid|not valid/i.test(body.slice(0, 300))) return { ok: false, provider: "callmebot", reason: body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160) || `HTTP ${res.status}` };
    return { ok: true, provider: "callmebot" };
  } catch (e) {
    return { ok: false, provider: "callmebot", reason: e instanceof Error ? e.message : "network error" };
  }
}

export async function sendWhatsApp({ to, text, template, kind = "message" }: { to: string; text: string; template?: WaTemplate; kind?: string }): Promise<WaResult> {
  const dest = digits(to);
  const provider = whatsappProvider();
  let result: WaResult;
  if (!dest || dest.length < 10) result = { ok: false, provider, reason: "invalid recipient number" };
  else if (provider === "cloud") result = await sendCloud(dest, text, template);
  else if (provider === "callmebot") result = await sendCallMeBot(dest, template ? `${text}` : text);
  else result = { ok: false, provider: "none", reason: "not configured" };
  await log({ at: new Date().toISOString(), to: `+${dest}`, kind, provider: result.provider, ok: result.ok, reason: result.reason, preview: (template ? `[template ${template.name}] ` : "") + text.slice(0, 140) });
  return result;
}
