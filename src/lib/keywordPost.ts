import { slugify } from "./markdown";
import { db } from "./db";
import type { Post } from "./posts";
import type { Opportunity } from "./gsc";
import { SITE } from "./site";
import { writeKeywordPostWithClaude } from "./ai";
import { hasAiWriter } from "./llm";

/**
 * Keyword-targeted articles for Search Console opportunities: queries that already
 * get impressions but have no dedicated page or sit just outside page one.
 */

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export function keywordSlug(q: string) {
  return slugify(q).slice(0, 80);
}

function detectIntent(q: string): "howto" | "cost" | "best" | "vs" | "what" | "general" {
  const s = q.toLowerCase();
  if (/^(how|steps|guide|tips)/.test(s)) return "howto";
  if (/(cost|price|pricing|charges|fees|budget|rate)/.test(s)) return "cost";
  if (/(best|top|agency|company|services|near me)/.test(s)) return "best";
  if (/\bvs\b|versus|difference/.test(s)) return "vs";
  if (/^(what|why|is|does|which)/.test(s)) return "what";
  return "general";
}

export function composeKeywordPost(o: Opportunity, date = new Date()): Post {
  const q = o.query.trim();
  const topic = titleCase(q);
  const intent = detectIntent(q);
  const titles: Record<ReturnType<typeof detectIntent>, string> = {
    howto: `${topic}: A Step-by-Step Guide for Indian Businesses (${date.getFullYear()})`,
    cost: `${topic} in ${date.getFullYear()}: Real Numbers, What Affects It, and How to Pay Less`,
    best: `${topic}: How to Choose Right (Checklist + Red Flags)`,
    vs: `${topic}: Which One Should Your Business Pick?`,
    what: `${topic}? A Plain-English Answer for Business Owners`,
    general: `${topic}: The Complete Guide for Businesses in Delhi NCR and India`,
  };
  const title = titles[intent];
  const category = /seo|google|rank|keyword|backlink/.test(q) ? "SEO" : /instagram|social|reel|facebook|linkedin|youtube/.test(q) ? "Social Media" : /ads|ppc|meta|campaign|roas|cpc/.test(q) ? "Paid Ads" : /website|landing|shopify|wordpress|web/.test(q) ? "Web" : /brand|logo|creative|design/.test(q) ? "Branding" : "Content";

  const content = `If you searched for **"${q}"**, you are probably deciding how to spend time or money on it. This guide answers that directly, with the practical details we use with clients at ${SITE.name} in ${SITE.city}.

## ${topic}: the short answer

${intent === "cost" ? `Costs vary with scope, competition and the team you hire. Below is a realistic range for India, what moves the number up or down, and how to get more for the same budget.` : intent === "howto" ? `You can do this in a structured way in a few weeks if you follow the steps below in order. Each step has a checklist so nothing is missed.` : intent === "best" ? `The right choice depends on your goals, budget and how hands-on you want to be. Use the checklist below to compare options objectively instead of going by pitches.` : intent === "vs" ? `Both options work. The decision comes down to speed of results, budget and how long you want the gains to last. Here is a side-by-side view.` : `Here is what it means, why it matters for a business in India, and exactly what to do about it this month.`}

## Why ${topic} matters right now

- **Search demand is real.** People in India search for this every day, and most of them are comparing options before they buy or hire.
- **The gap is execution.** Most businesses know they need this but do it inconsistently. Consistency is the advantage.
- **It compounds.** Done right, the results keep paying back months after the work is done.

## ${intent === "howto" ? "Step-by-step" : intent === "cost" ? "What affects the cost" : intent === "best" ? "Checklist: what to look for" : intent === "vs" ? "Side-by-side comparison" : "What to do, in order"}

1. **Define the outcome in numbers.** Leads per month, cost per lead, revenue, or rankings for specific keywords. Everything else follows from this.
2. **Audit where you stand.** Website speed, Google Business Profile, current rankings, ad account structure, social content performance.
3. **Fix the foundation first.** Tracking (GA4, Search Console, pixels), fast mobile pages, clear offers and calls to action.
4. **Pick one or two channels.** For most Delhi NCR businesses that is Google (SEO or Ads) plus Instagram. Add more only once those are working.
5. **Publish and optimise weekly.** Content, creatives and bids need weekly attention. Monthly is too slow.
6. **Report in rupees.** Track leads and revenue, not impressions and likes.

## Common mistakes with ${topic}

- Chasing vanity metrics instead of leads and sales.
- Switching strategies every few weeks before anything can compound.
- No conversion tracking, so nobody knows what actually worked.
- Copying competitors instead of answering what customers are searching for.

## How ${SITE.name} approaches ${topic}

We start with a free audit, agree on the numbers that matter, and run a 90-day plan with weekly optimisation and a live dashboard. Explore our [services](/services) or [get a free growth audit](/contact).

## FAQs

**How long before ${topic} shows results?**
Paid channels show results within days; SEO and content usually need 8 to 12 weeks to show measurable movement and keep compounding after that.

**Can a small business afford ${topic}?**
Yes. Start with one channel, a clear offer and tight tracking. Scale budget only when the cost per lead is proven.

**Do you work outside Delhi NCR?**
Yes. We serve clients across India remotely, with the same reporting and weekly calls.
`;

  return {
    slug: keywordSlug(q),
    title,
    excerpt: `${topic}: a practical, no-fluff guide for Indian businesses, with steps, costs, mistakes to avoid and FAQs.`,
    content,
    category,
    tags: [q.toLowerCase(), "guide", category.toLowerCase()],
    status: "published",
    publishedAt: date.toISOString(),
    updatedAt: date.toISOString(),
    author: `${SITE.name} Editorial`,
    seoTitle: title.length > 60 ? `${topic} | ${SITE.name}` : `${title} | ${SITE.name}`,
    seoDescription: `${topic}: what it is, what it costs, how to do it right and mistakes to avoid. A practical guide from ${SITE.name}, ${SITE.city}.`.slice(0, 155),
    source: "keyword",
    trendTopic: q,
    trendTraffic: `${o.impressions} impressions / 28d`,
  };
}

export async function buildKeywordPost(o: Opportunity, date = new Date()): Promise<Post> {
  const base = composeKeywordPost(o, date);
  if (!hasAiWriter()) return base;
  try {
    const ai = await writeKeywordPostWithClaude(o, base);
    if (!ai.content) throw new Error("empty AI response");
    return { ...base, ...ai };
  } catch (e) {
    console.error("keyword post AI failed:", (e as Error).message);
    try { await db.set("ai:lastError", { at: new Date().toISOString(), kind: "keyword", message: (e as Error).message.slice(0, 500) }); } catch {}
    return base;
  }
}
