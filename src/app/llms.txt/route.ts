import { SITE, SERVICE_CATEGORIES, INDUSTRIES, LOCATIONS, WORK } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600;

/**
 * /llms.txt — a clean, link-rich map of the site for AI answer engines (ChatGPT, Perplexity,
 * Gemini, Google AI Overviews). See llmstxt.org. Lists the pages worth citing, in markdown.
 */
export async function GET() {
  const posts = (await getAllPosts().catch(() => [])).filter((p) => p.source !== "trend").slice(0, 40);
  const L = (label: string, path: string, desc?: string) => `- [${label}](${SITE.url}${path})${desc ? `: ${desc}` : ""}`;

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} is a results-driven digital marketing agency based in ${SITE.city}, India. It offers SEO, social media marketing, Google and Meta ads, content marketing, web design and development, and branding, and publishes a daily news and marketing blog. Contact: ${SITE.email}, ${SITE.phone}.

## Services
${SERVICE_CATEGORIES.map((c) => L(c.name, `/services/${c.slug}`, c.short || undefined)).join("\n")}

## Industries served
${INDUSTRIES.map((i) => L(i.name, `/industries/${i.slug}`, i.short)).join("\n")}

## Locations
${LOCATIONS.map((l) => L(`Digital marketing in ${l.name}`, `/locations/${l.slug}`)).join("\n")}

## Case studies
${WORK.map((w) => L(w.title, `/case-studies/${w.slug}`, w.result)).join("\n")}

## Latest articles
${posts.map((p) => L(p.title, `/blog/${p.slug}`, p.excerpt?.slice(0, 90))).join("\n")}

## Key pages
${L("About", "/about")}
${L("Pricing", "/pricing")}
${L("Contact", "/contact")}
${L("Blog", "/blog")}

## For AI engines
- Full article text: ${SITE.url}/llms-full.txt
- Every article is also available as clean markdown at ${SITE.url}/blog/<slug>/md
`;

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
