import { db } from "./db";
import { savePost, type Post } from "./posts";
import { isLowQualityCover } from "./cover";

/**
 * High-quality covers for posts, generated on publish.
 *  1. OPENAI_API_KEY  -> gpt-image-1 illustration (stored in Redis, served by /api/cover-img/<slug>)
 *  2. PEXELS_API_KEY  -> relevant stock photo (URL stored on the post, with credit)
 *  3. nothing         -> the branded /api/cover render is used automatically (see cover.ts)
 * Never throws; returns the new cover URL or null.
 */

export const coverKey = (slug: string) => `cover:${slug}`;

export type StoredCover = { mime: string; b64: string; at: string; provider: string };

async function viaOpenAI(post: Post): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const topic = post.trendTopic || post.title;
  const prompt = `Editorial cover illustration for a digital-marketing blog article about "${topic}". Modern, clean, premium flat-3D style with soft lighting, indigo (#4f46e5) and amber (#f59e0b) accents on a dark navy background, abstract objects that suggest ${post.category.toLowerCase()} (charts, phones, search bars, megaphones, shopping bags as relevant). No text, no letters, no logos, no watermarks, no people's faces. Wide 3:2 composition with clear space on the left.`;
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1", prompt, size: "1536x1024", quality: process.env.OPENAI_IMAGE_QUALITY || "medium", output_format: "jpeg", output_compression: 72, n: 1 }),
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) throw new Error(`OpenAI images ${res.status}: ${(await res.text()).slice(0, 160)}`);
  const j = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = j.data?.[0]?.b64_json;
  if (!b64) return null;
  await db.set(coverKey(post.slug), { mime: "image/jpeg", b64, at: new Date().toISOString(), provider: "openai" } satisfies StoredCover);
  return `/api/cover-img/${post.slug}`;
}

async function viaPexels(post: Post): Promise<{ url: string; credit: string } | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  const words = (post.trendTopic || post.title).replace(/[^a-z0-9 ]/gi, " ").split(/\s+/).filter((w) => w.length > 3).slice(0, 4).join(" ");
  const query = `${words} ${post.category}`.trim() || "digital marketing";
  const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=5`, { headers: { Authorization: key }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`Pexels ${res.status}`);
  const j = (await res.json()) as { photos?: { src: { large2x: string; large: string }; photographer: string }[] };
  const p = j.photos?.[0];
  if (!p) return null;
  return { url: p.src.large2x || p.src.large, credit: `${p.photographer} / Pexels` };
}

/** Generate (if possible) and persist a better cover for a post. */
export async function ensureCover(post: Post, force = false): Promise<string | null> {
  if (!force && post.cover && !isLowQualityCover(post.cover)) return post.cover;
  try {
    const ai = await viaOpenAI(post);
    if (ai) {
      await savePost({ ...post, cover: ai, coverCredit: undefined });
      return ai;
    }
    const stock = await viaPexels(post);
    if (stock) {
      await savePost({ ...post, cover: stock.url, coverCredit: stock.credit });
      return stock.url;
    }
  } catch (e) {
    try { await db.set("cover:lastError", { at: new Date().toISOString(), slug: post.slug, message: (e as Error).message.slice(0, 300) }); } catch {}
  }
  return null;
}

export function coverProvider() {
  if (process.env.OPENAI_API_KEY) return "OpenAI images";
  if (process.env.PEXELS_API_KEY) return "Pexels photos";
  return "branded render";
}
