import { SITE } from "@/lib/site";
import { getPost, getAllPosts } from "@/lib/posts";
import { authorFor } from "@/lib/authors";

export const revalidate = 1800;

/**
 * /blog/[slug]/md — a clean markdown version of each article for AI ingestion (GEO item #13b).
 * Returns an H1 title, a meta line, and the raw markdown body as text/markdown.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });

  const author = authorFor(post);
  const date = new Date(post.publishedAt).toISOString().slice(0, 10);
  const canonical = `${SITE.url}/blog/${post.slug}`;

  const body = `# ${post.title}

> ${post.excerpt}

**By ${author.name} (${author.role}) · ${SITE.name} · ${post.category} · ${date}**
Canonical: ${canonical}

${post.content.trim()}

${post.outbound?.length ? `\n## Sources\n${post.outbound.map((o) => `- [${o.title}](${o.url}) — ${o.source}`).join("\n")}\n` : ""}
---
${SITE.name} — ${SITE.tagline}. ${SITE.url}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=1800, s-maxage=1800",
      "x-robots-tag": "all",
    },
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts().catch(() => []);
  return posts.slice(0, 50).map((p) => ({ slug: p.slug }));
}
