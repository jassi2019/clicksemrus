import Anthropic from "@anthropic-ai/sdk";

/**
 * Provider-agnostic JSON generation for the blog writers.
 * Order: ANTHROPIC_API_KEY (Claude) -> GEMINI_API_KEY (Google, free tier) -> GROQ_API_KEY (Llama, free tier).
 * Returns null when no provider is configured so callers fall back to the template writer.
 */

export type LlmProvider = "claude" | "gemini" | "groq" | null;

export function aiProvider(): LlmProvider {
  if (process.env.ANTHROPIC_API_KEY) return "claude";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.GROQ_API_KEY) return "groq";
  return null;
}

export const hasAiWriter = () => aiProvider() !== null;

export function aiProviderLabel() {
  const p = aiProvider();
  return p === "claude" ? "Claude" : p === "gemini" ? "Gemini" : p === "groq" ? "Groq" : "template";
}

/** Escape raw control characters that some models emit inside JSON string literals. */
function repairJson(src: string): string {
  let out = "";
  let inStr = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === "\\") { out += ch + (src[i + 1] ?? ""); i++; continue; }
      if (ch === '"') { inStr = false; out += ch; continue; }
      const code = ch.charCodeAt(0);
      if (code === 10) { out += "\\n"; continue; }
      if (code === 13) { out += "\\r"; continue; }
      if (code === 9) { out += "\\t"; continue; }
      if (code < 32) continue;
      out += ch;
    } else {
      if (ch === '"') inStr = true;
      out += ch;
    }
  }
  return out;
}

function extractJson<T>(text: string): T {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const slice = cleaned.slice(start, end + 1);
  try { return JSON.parse(slice) as T; } catch { return JSON.parse(repairJson(slice)) as T; }
}

async function viaClaude<T>(system: string, user: string): Promise<T> {
  const client = new Anthropic();
  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium" },
    system,
    messages: [{ role: "user", content: user }],
  });
  if (response.stop_reason === "refusal") throw new Error("refused");
  const text = response.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("");
  return extractJson<T>(text);
}

async function viaGemini<T>(system: string, user: string): Promise<T> {
  const models = Array.from(new Set([process.env.GEMINI_MODEL, "gemini-flash-lite-latest", "gemini-3.8-flash", "gemini-flash-latest"].filter(Boolean))) as string[];
  let lastErr: Error | null = null;
  for (const model of models) {
    try { return await geminiCall<T>(model, system, user); } catch (e) { lastErr = e as Error; if (!/404|NOT_FOUND|not available|429|RESOURCE_EXHAUSTED|quota|503|UNAVAILABLE|overloaded|timeout/i.test(lastErr.message)) break; }
  }
  throw lastErr || new Error("Gemini failed");
}

async function geminiCall<T>(model: string, system: string, user: string): Promise<T> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    signal: AbortSignal.timeout(Number(process.env.GEMINI_TIMEOUT_MS || 70000)),
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192, responseMimeType: "application/json", ...(/gemini-3/.test(model) ? { thinkingConfig: { thinkingLevel: process.env.GEMINI_THINKING || "low" } } : {}) },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  return extractJson<T>(text);
}

async function viaGroq<T>(system: string, user: string): Promise<T> {
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return extractJson<T>(j.choices?.[0]?.message?.content || "");
}

/** Generate a JSON object from a system + user prompt with whichever provider is configured. */
export async function generateJson<T>(system: string, user: string): Promise<T | null> {
  const p = aiProvider();
  if (p === "claude") return viaClaude<T>(system, user);
  if (p === "gemini") return viaGemini<T>(system, user);
  if (p === "groq") return viaGroq<T>(system, user);
  return null;
}
