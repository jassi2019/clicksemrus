import { SITE, SERVICE_CATEGORIES, INDUSTRIES } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";
import { authorFor } from "@/lib/authors";

export const revalidate = 3600;

/**
 * /llms-full.txt — like /llms.txt but includes the full markdown body of the ~20 latest posts,
 * so AI engines can ingest the actual content, not just links. See llmstxt.org (llms-full.txt).
 */
export async function GET() {
  const posts = (await getAllPosts().catch(() => [])).filter((p) => p.source !== "trend").slice(0, 20);

  const articles = posts
    .map((p) => {
      const author = authorFor(p);
      const date = new Date(p.publishedAt).toISOString().slice(0, 10);
      return `## ${p.title}
URL: ${SITE.url}/blog/${p.slug}
Author: ${author.name} (${author.role}) · Category: ${p.category} · Date: ${date}

${p.excerpt}

${p.content.trim()}
`;
    })
    .join("\n\n---\n\n");

  const body = `# ${SITE.name} — Full Content for AI Engines

> ${SITE.description}

${SITE.name} is a results-driven digital marketing agency based in ${SITE.city}, India, offering SEO, social media marketing, Google and Meta ads, content marketing, web design and development, and branding. Contact: ${SITE.email}, ${SITE.phone}.

## Services
${SERVICE_CATEGORIES.map((c) => `- ${c.name} (${SITE.url}/services/${c.slug}): ${c.short}`).join("\n")}

## Industries served
${INDUSTRIES.map((i) => `- ${i.name} (${SITE.url}/industries/${i.slug}): ${i.short}`).join("\n")}

# Latest articles (full text)

${articles}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "x-robots-tag": "all",
    },
  });
}
