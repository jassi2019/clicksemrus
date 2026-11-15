import type { Post } from "./posts";
import type { Trend } from "./trending";
import { SITE } from "./site";
import { generateJson } from "./llm";

/**
 * Richer articles written by an LLM (Claude, Gemini or Groq, whichever key is set; see llm.ts).
 * When no provider is configured the template writers in trending.ts / keywordPost.ts are used.
 */

type Draft = Partial<Pick<Post, "title" | "excerpt" | "seoTitle" | "seoDescription" | "content" | "category">>;

const SYSTEM_TREND = `You are a fast, accurate news-explainer writer for ${SITE.name}, a digital marketing agency in ${SITE.city}, India. People are searching this topic on Google right now; write the page that best answers that search. Use only facts present in the provided sources; if a fact (score, date, result, cast, price) is not in the sources, say it is not confirmed yet instead of guessing. Clear Indian English, short paragraphs, markdown with ## and ### headings, bullet lists and one table where useful. Link to the sources inline as markdown links. No top-level H1. Respond with a single JSON object only.`;

const SYSTEM_KEYWORD = `You are the senior SEO content writer at ${SITE.name}, a digital marketing agency in ${SITE.city}, India. Write helpful, specific, search-intent-matching articles in clear Indian English for business owners. Use markdown with ## and ### headings, short paragraphs, bullet lists and a comparison table where useful. Give realistic Indian price ranges in rupees when the query is about cost. Mention the agency's services naturally and link to /services and /contact once each. End with a 3-question FAQ. No top-level H1. Never invent statistics or client names. Respond with a single JSON object only.`;

const pick = (d: Draft | null): Partial<Post> =>
  d ? { title: d.title, excerpt: d.excerpt, seoTitle: d.seoTitle, seoDescription: d.seoDescription, content: d.content, ...(d.category ? { category: d.category } : {}) } : {};

export async function writeWithClaude(t: Trend, _base: Post, context = ""): Promise<Partial<Post>> {
  const sources = t.news.slice(0, 4).map((n) => `- ${n.title} (${n.source}) ${n.url}`).join("\n");
  const user = `Search topic trending in India right now: "${t.title}"${t.traffic && t.traffic !== "news" ? ` (${t.traffic} searches today)` : ""}.
Headlines:
${sources}
${context ? `\nSource article text (use these facts):\n${context.slice(0, 7000)}\n` : ""}
Write a 900-1300 word article that satisfies the search intent for "${t.title}":
1. First 60 words: the direct answer (what happened / result / who / when).
2. "## What happened" with the key facts, numbers, names and timeline from the sources (cite them).
3. A section matching the intent: for a match -> score, key moments, player stats, what's next; for a show/film -> episode or release details, cast, where to watch; for an exam/result -> dates, links, steps; for business/finance -> numbers, reasons, impact; for a general event -> background, reactions, what's next.
4. "## Why it is trending" (2-3 short paragraphs).
5. "## FAQs" with 4 questions people actually type into Google about "${t.title}" (when, where to watch, result, next date, etc.), each answered in 1-2 lines.
6. A final short "## For brands: the marketing angle" paragraph (max 90 words) that mentions moment marketing and links to /services.
Return JSON only with keys: title (max 65 chars, MUST start with the exact phrase "${t.title}" in Title Case, then a colon and the specific hook e.g. score, result, date or verdict), excerpt (max 155 chars, specific), seoTitle (max 60, start with the phrase), seoDescription (max 155), content (markdown), category (one of: Trending, Entertainment Marketing, SEO, Social Media, Paid Ads, Content, Branding, Web).`;
  return pick(await generateJson<Draft>(SYSTEM_TREND, user));
}

export async function writeKeywordPostWithClaude(o: { query: string; impressions: number; position: number; page: string }, _base: Post): Promise<Partial<Post>> {
  const user = `Target search query: "${o.query}". Google Search Console shows it earned ${o.impressions} impressions in 28 days at average position ${o.position.toFixed(1)} (currently landing on ${o.page || "no dedicated page"}).
Write a 1200-1600 word article that fully satisfies this query and can rank on page one in India. Cover: direct answer in the first 80 words, step-by-step or comparison as the intent requires, costs/timelines where relevant, common mistakes, and when to hire an agency. Use the exact query phrase in the title, first paragraph and one H2.
Return JSON only with keys: title (max 65 chars, must contain the query phrase), excerpt (max 160 chars), seoTitle (max 60), seoDescription (max 155), content (markdown), category (one of: SEO, Social Media, Paid Ads, Content, Branding, Web).`;
  return pick(await generateJson<Draft>(SYSTEM_KEYWORD, user));
}
