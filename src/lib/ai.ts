import type { Post } from "./posts";
import type { Trend } from "./trending";
import { SITE } from "./site";
import { generateJson } from "./llm";

/**
 * Richer articles written by an LLM (Claude, Gemini or Groq, whichever key is set; see llm.ts).
 * When no provider is configured the template writers in trending.ts / keywordPost.ts are used.
 */

type Draft = Partial<Pick<Post, "title" | "excerpt" | "seoTitle" | "seoDescription" | "content" | "category">>;

const SYSTEM_TREND = `You are the senior content writer at ${SITE.name}, a digital marketing agency in ${SITE.city}, India. Write SEO blog posts in clear Indian English for business owners and marketers. Use markdown with ## headings. Never fabricate facts about the news; only use the provided sources. Mention the agency's services naturally (SEO, social media marketing, Meta Ads, Google Ads, content marketing, web design) without being spammy. Include a short FAQ section at the end. Do not include a top-level H1. Respond with a single JSON object only.`;

const SYSTEM_KEYWORD = `You are the senior SEO content writer at ${SITE.name}, a digital marketing agency in ${SITE.city}, India. Write helpful, specific, search-intent-matching articles in clear Indian English for business owners. Use markdown with ## and ### headings, short paragraphs, bullet lists and a comparison table where useful. Give realistic Indian price ranges in rupees when the query is about cost. Mention the agency's services naturally and link to /services and /contact once each. End with a 3-question FAQ. No top-level H1. Never invent statistics or client names. Respond with a single JSON object only.`;

const pick = (d: Draft | null): Partial<Post> =>
  d ? { title: d.title, excerpt: d.excerpt, seoTitle: d.seoTitle, seoDescription: d.seoDescription, content: d.content, ...(d.category ? { category: d.category } : {}) } : {};

export async function writeWithClaude(t: Trend, _base: Post): Promise<Partial<Post>> {
  const sources = t.news.slice(0, 4).map((n) => `- ${n.title} (${n.source}) ${n.url}`).join("\n");
  const user = `Topic trending on Google India today: "${t.title}" (${t.traffic} searches).
Sources:
${sources}

Write a 900-1200 word blog post that (1) explains why it is trending using the sources with markdown links to them, (2) gives 5 concrete moment-marketing ideas brands can act on within 24 hours, (3) includes rules for brand-safe trend-jacking, (4) ends with a FAQ of 3 questions and a call to action to contact ${SITE.name}.
Return JSON only with keys: title (max 65 chars), excerpt (max 160 chars), seoTitle (max 60), seoDescription (max 155), content (markdown).`;
  return pick(await generateJson<Draft>(SYSTEM_TREND, user));
}

export async function writeKeywordPostWithClaude(o: { query: string; impressions: number; position: number; page: string }, _base: Post): Promise<Partial<Post>> {
  const user = `Target search query: "${o.query}". Google Search Console shows it earned ${o.impressions} impressions in 28 days at average position ${o.position.toFixed(1)} (currently landing on ${o.page || "no dedicated page"}).
Write a 1200-1600 word article that fully satisfies this query and can rank on page one in India. Cover: direct answer in the first 80 words, step-by-step or comparison as the intent requires, costs/timelines where relevant, common mistakes, and when to hire an agency. Use the exact query phrase in the title, first paragraph and one H2.
Return JSON only with keys: title (max 65 chars, must contain the query phrase), excerpt (max 160 chars), seoTitle (max 60), seoDescription (max 155), content (markdown), category (one of: SEO, Social Media, Paid Ads, Content, Branding, Web).`;
  return pick(await generateJson<Draft>(SYSTEM_KEYWORD, user));
}
