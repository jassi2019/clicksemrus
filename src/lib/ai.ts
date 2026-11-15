import type { Post } from "./posts";
import type { Trend } from "./trending";
import { SITE } from "./site";
import { generateJson } from "./llm";

/**
 * Richer articles written by an LLM (Claude, Gemini or Groq, whichever key is set; see llm.ts).
 * When no provider is configured the template writers in trending.ts / keywordPost.ts are used.
 */

type Draft = Partial<Pick<Post, "title" | "excerpt" | "seoTitle" | "seoDescription" | "content" | "category">>;

const SYSTEM_TREND = `You are a news and explainer journalist writing for an Indian audience. People are searching this topic on Google right now; write the single best, most informative page that answers their search. This is a straight news/explainer article, NOT a marketing article: do NOT turn it into advice for brands, do NOT mention marketing, agencies, moment marketing, SEO, or any business/CTA, and do NOT promote any company. Use ONLY facts present in the provided sources; if a specific fact (score, date, result, cast, price, number) is not in the sources, say it is not confirmed yet rather than inventing it. Follow the structure of top publishers: a direct-answer opening, a short "Key points" list, clear ## and ### sections, short 1-3 sentence paragraphs, bullet lists and a table where useful, and an FAQ. Cite sources inline as markdown links. Clear, neutral Indian English. No top-level H1. Respond with a single JSON object only.`;

const SYSTEM_KEYWORD = `You are the senior SEO content writer at ${SITE.name}, a digital marketing agency in ${SITE.city}, India. Write helpful, specific, search-intent-matching articles in clear Indian English for business owners. Use markdown with ## and ### headings, short paragraphs, bullet lists and a comparison table where useful. Give realistic Indian price ranges in rupees when the query is about cost. Mention the agency's services naturally and link to /services and /contact once each. End with a 3-question FAQ. No top-level H1. Never invent statistics or client names. Respond with a single JSON object only.`;

const pick = (d: Draft | null): Partial<Post> =>
  d ? { title: d.title, excerpt: d.excerpt, seoTitle: d.seoTitle, seoDescription: d.seoDescription, content: d.content, ...(d.category ? { category: d.category } : {}) } : {};

export async function writeWithClaude(t: Trend, _base: Post, context = ""): Promise<Partial<Post>> {
  const sources = t.news.slice(0, 4).map((n) => `- ${n.title} (${n.source}) ${n.url}`).join("\n");
  const user = `Search topic trending in India right now: "${t.title}"${t.traffic && t.traffic !== "news" ? ` (${t.traffic} searches today)` : ""}.
Headlines:
${sources}
${context ? `\nSource article text (use these facts):\n${context.slice(0, 7000)}\n` : ""}
Write a 700-1100 word informative news article about "${t.title}" using this structure:
1. Direct-answer opening (first 50-60 words): state plainly what happened / the result / who / when / where.
2. "## Key points" — a 3-5 bullet TL;DR of the most important facts (scores, dates, names, numbers).
3. "## What happened" — the full story: facts, numbers, names and timeline from the sources, cited as markdown links.
4. An intent-matched section with its own ## heading: a cricket/football match -> final score, key moments, standout performers, what is next; a film/show/celebrity -> release or episode details, cast, where to watch, reactions; an exam/result/admit card -> dates, official link, how to check steps; business/finance/stock -> the numbers, the reason, the impact; a general event -> background, who is involved, reactions, what happens next.
5. "## Why it is in the news" — 2-3 short paragraphs of context.
6. "## FAQ" — 4-5 real questions people type into Google about "${t.title}" (score? when? where to watch? result? next date? who won?), each answered in 1-2 factual lines.
Keep it strictly factual and neutral. No marketing, no brand mentions, no CTA.
Return JSON only with keys: title (max 70 chars, MUST start with the exact phrase "${t.title}" in Title Case, then a colon and the specific factual hook e.g. the score/result/date/verdict), excerpt (max 155 chars, the direct factual answer), seoTitle (max 60, start with the phrase), seoDescription (max 155, factual), content (markdown), category (one of: Sports, Entertainment, Business, Technology, Education, India News, Trending).`;
  return pick(await generateJson<Draft>(SYSTEM_TREND, user));
}

export async function writeKeywordPostWithClaude(o: { query: string; impressions: number; position: number; page: string }, _base: Post): Promise<Partial<Post>> {
  const user = `Target search query: "${o.query}". Google Search Console shows it earned ${o.impressions} impressions in 28 days at average position ${o.position.toFixed(1)} (currently landing on ${o.page || "no dedicated page"}).
Write a 1200-1600 word article that fully satisfies this query and can rank on page one in India. Cover: direct answer in the first 80 words, step-by-step or comparison as the intent requires, costs/timelines where relevant, common mistakes, and when to hire an agency. Use the exact query phrase in the title, first paragraph and one H2.
Return JSON only with keys: title (max 65 chars, must contain the query phrase), excerpt (max 160 chars), seoTitle (max 60), seoDescription (max 155), content (markdown), category (one of: SEO, Social Media, Paid Ads, Content, Branding, Web).`;
  return pick(await generateJson<Draft>(SYSTEM_KEYWORD, user));
}
