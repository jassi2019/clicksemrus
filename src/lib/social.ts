import { db } from "./db";
import { generateJson } from "./llm";
import { SITE } from "./site";
import type { Post } from "./posts";

/**
 * Social sharing kit for an article: ready-to-paste LinkedIn post, Instagram caption, WhatsApp message and
 * X post, written from the article itself. Links carry UTM tags so GA4 shows which channel sent the visit.
 * Stored at share:<slug>; generated when an article is published and on demand from Admin -> Share kit.
 */
export type ShareKit = { linkedin: string; instagram: string; whatsapp: string; x: string; at: string };

const key = (slug: string) => `share:${slug}`;

export const shareUrl = (slug: string, source: string) =>
  `${SITE.url}/blog/${slug}?utm_source=${source}&utm_medium=social&utm_campaign=blog_share`;

export async function getShareKit(slug: string): Promise<ShareKit | null> {
  return db.get<ShareKit>(key(slug)).catch(() => null);
}

const SYSTEM = `You write social media posts for ${SITE.name}, a digital marketing agency serving businesses across India. Tone: plain, practical, confident, Indian English. Share real takeaways from the article, no hype, no emojis overload (max 3 per post), never invent statistics, client names or results. Respond with a single JSON object only.`;

export async function makeShareKit(post: Post): Promise<ShareKit | null> {
  const user = `Article title: "${post.title}"
Summary: ${post.excerpt}
Article (use only facts from here):
${post.content.slice(0, 3000)}

Write four posts that make people want to read the full article. Use the literal placeholder {LINK} where the article link goes.
- linkedin: 700-1200 characters. A strong first line (the hook), a blank line, 3-5 short takeaways from the article as lines starting with "•", one question that invites comments, then "Full guide: {LINK}", then 3-5 relevant hashtags.
- instagram: 350-650 characters with line breaks, hook first, 3 quick takeaways, end with "Full guide: link in bio", then 8-12 relevant hashtags. Do not use {LINK} here.
- whatsapp: under 320 characters. One hook line, one useful takeaway, then "Read: {LINK}".
- x: under 250 characters including {LINK}, one sharp takeaway plus {LINK} and 1-2 hashtags.
Return JSON with keys: linkedin, instagram, whatsapp, x.`;
  const r = await generateJson<{ linkedin?: string; instagram?: string; whatsapp?: string; x?: string }>(SYSTEM, user);
  if (!r?.linkedin || !r.whatsapp) return null;
  const fill = (t: string | undefined, src: string) => (t || "").split("{LINK}").join(shareUrl(post.slug, src)).trim();
  const kit: ShareKit = {
    linkedin: fill(r.linkedin, "linkedin"),
    instagram: (r.instagram || "").split("{LINK}").join("link in bio").trim(),
    whatsapp: fill(r.whatsapp, "whatsapp"),
    x: fill(r.x, "x"),
    at: new Date().toISOString(),
  };
  await db.set(key(post.slug), kit);
  return kit;
}
