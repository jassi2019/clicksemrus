/**
 * Our own pages a news article links to (owner's rule, Nov 2026: every trend post interlinks the site).
 * Picked by the article's category; the AI writer gets the same list and is asked to weave 2-3 in,
 * and ensureInternalLinks appends them when the writer did not.
 */
const LINKS = {
  social: [
    { t: "Instagram marketing cost in India", u: "/blog/instagram-marketing-cost-in-india" },
    { t: "How to run Instagram ads for a small business", u: "/blog/how-to-run-instagram-ads-for-a-small-business-in-india" },
    { t: "Social media marketing services", u: "/services/social-media-marketing" },
  ],
  growth: [
    { t: "What is performance marketing", u: "/blog/what-is-performance-marketing" },
    { t: "Google Ads vs Meta Ads for lead generation", u: "/blog/google-ads-vs-meta-ads-for-lead-generation-in-india" },
    { t: "Paid ads management", u: "/services/paid-ads" },
  ],
  search: [
    { t: "How to do SEO for a new website in India", u: "/blog/how-to-do-seo-for-a-new-website-in-india" },
    { t: "How long does SEO take to show results", u: "/blog/how-long-does-seo-take-to-show-results" },
    { t: "SEO services", u: "/services/seo" },
  ],
};

const BY_CATEGORY: Record<string, (keyof typeof LINKS)[]> = {
  Entertainment: ["social", "growth"],
  Sports: ["social", "growth"],
  Trending: ["social", "search"],
  Business: ["growth", "search"],
  Technology: ["search", "growth"],
  Education: ["search", "social"],
  "India News": ["social", "search"],
};

export type InternalLink = { t: string; u: string };

/** Three pages for a category: two from its main group, one from the second. */
export function internalLinksFor(category?: string): InternalLink[] {
  const [a, b] = BY_CATEGORY[category || ""] || ["social", "search"];
  return [LINKS[a][0], LINKS[a][2], LINKS[b][0]];
}

/** Every page the writer may link to, for the prompt. */
export function allInternalLinks(): InternalLink[] {
  return [...LINKS.social, ...LINKS.growth, ...LINKS.search];
}

/** Guarantee the interlinking: with fewer than 2 links to our pages, append a short related-reading list. */
export function ensureInternalLinks(content: string, category?: string): string {
  const own = (content.match(/\]\(\/(blog|services|case-studies|pricing|contact)[^)]*\)/g) || []).length;
  if (own >= 2) return content;
  const list = internalLinksFor(category).map((l) => `- [${l.t}](${l.u})`).join("\n");
  return `${content.trimEnd()}\n\n## Related reading\n\n${list}\n`;
}
