import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { SITE, SERVICE_CATEGORIES, HOME_FAQS, PRICING_SUMMARY, LOCATIONS } from "@/lib/site";

export const maxDuration = 60;

const MAX_TURNS = 12; // user turns
const LIMIT = 20; // requests
const WINDOW_SEC = 600; // per 10 minutes

type ChatMessage = { role: "user" | "assistant"; content: string };

function systemPrompt() {
  const services = SERVICE_CATEGORIES.map((c) => `- ${c.name} (${SITE.url}/services/${c.slug}): ${c.subs.map((s) => s.name).join(", ")}`).join("\n");
  const faqs = HOME_FAQS.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
  return `You are Semi, the friendly growth assistant on the ${SITE.name} website (${SITE.url}). ${SITE.name} is a ${SITE.tagline.toLowerCase()} serving ${LOCATIONS.map((l) => l.name).join(", ")} and all of India.

Your job: understand what the visitor wants to grow, point them to the right service page, answer pricing and process questions honestly, and get them to book a free 30-minute strategy call or share their phone/email so a strategist can follow up.

Services:
${services}

Pricing summary:
${PRICING_SUMMARY}

FAQ:
${faqs}

Contact: email ${SITE.email}, WhatsApp https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}, contact page ${SITE.url}/contact, pricing ${SITE.url}/pricing.

Rules:
- Keep replies short (2 to 4 sentences, or a short list). Plain text, no markdown headings. Use Indian context (rupees, Delhi NCR).
- Never promise specific results, rankings or ROAS. Never invent prices beyond the summary; say "custom quote" when unsure.
- When the visitor seems interested, ask for their name, phone number and email so the team can call back, or suggest the contact page. Do not ask more than once per two turns.
- If asked about something unrelated to marketing or ${SITE.name}, politely steer back.
- Link to pages using full URLs from this prompt only.`;
}

async function rateLimited(ip: string) {
  try {
    const n = await db.incr(`ratelimit:chat:${ip}`, WINDOW_SEC);
    return n > LIMIT;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ ok: false, error: "Chat is not configured." }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (await rateLimited(ip)) return NextResponse.json({ ok: false, error: "Too many messages. Please try again in a few minutes or WhatsApp us." }, { status: 429 });

  let raw: { messages?: unknown };
  try {
    raw = (await req.json()) as { messages?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const messages: ChatMessage[] = (Array.isArray(raw.messages) ? raw.messages : [])
    .filter((m): m is ChatMessage => typeof m === "object" && m !== null && ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") && typeof (m as ChatMessage).content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }))
    .slice(-MAX_TURNS * 2);
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") return NextResponse.json({ ok: false, error: "Say something first." }, { status: 400 });
  if (messages.filter((m) => m.role === "user").length > MAX_TURNS) return NextResponse.json({ ok: false, error: "This chat has reached its limit. Please WhatsApp us or use the contact form." }, { status: 400 });

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: "claude-sonnet-5-5",
    max_tokens: 600,
    output_config: { effort: "low" },
    system: [{ type: "text", text: systemPrompt(), cache_control: { type: "ephemeral" } }],
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") controller.enqueue(encoder.encode(event.delta.text));
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") controller.enqueue(encoder.encode("I can't help with that one. For anything about growing your business, I'm here, or you can WhatsApp our team."));
      } catch {
        controller.enqueue(encoder.encode("\n\nSorry, I lost the connection. Please try again or WhatsApp us."));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-accel-buffering": "no" } });
}
