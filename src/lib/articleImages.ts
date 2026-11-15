import type { Post } from "./posts";

/**
 * In-article images (copyright-free, from Pexels).
 *
 * Given a post, fetch 1-2 relevant landscape photos and insert ONE into the markdown body,
 * right after the first H2 section, as a markdown image + a short caption line crediting Pexels.
 *
 * PEXELS_API_KEY is optional. When it is not set (or any error occurs) these helpers degrade
 * gracefully: `articleImages` returns [] and `withArticleImage` returns the body unchanged.
 */

export type ArticleImage = { url: string; credit: string; alt: string };

const CATEGORY_THEME: Record<string, string> = {
  Sports: "stadium sports crowd",
  Entertainment: "cinema film entertainment",
  Business: "business finance city",
  Technology: "technology computer",
  Education: "students exam classroom",
  "India News": "india city street",
  Trending: "news newspaper",
  SEO: "seo analytics laptop",
  "Social Media": "social media phone",
  "Paid Ads": "advertising dashboard",
  Content: "writing desk laptop",
  Branding: "design studio",
  Web: "web design laptop",
};

async function pexelsSearch(key: string, query: string): Promise<{ url: string; credit: string } | null> {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=8&size=large`,
      { headers: { Authorization: key }, signal: AbortSignal.timeout(15000) }
    );
    if (!res.ok) return null;
    const j = (await res.json()) as { photos?: { src: { large2x: string; large: string }; photographer: string }[] };
    const photos = j.photos || [];
    const p = photos[Math.floor(Math.random() * Math.min(4, photos.length || 1))];
    return p ? { url: p.src.large2x || p.src.large, credit: `${p.photographer} / Pexels` } : null;
  } catch {
    return null;
  }
}

/** Build a short search phrase from the post topic/title. */
function topicWords(post: Pick<Post, "trendTopic" | "title">): string {
  return (post.trendTopic || post.title)
    .replace(/[^a-z0-9 ]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 3)
    .join(" ");
}

/** Fetch up to `n` relevant Pexels landscape photos for a post. Returns [] when no key or on any error. */
export async function articleImages(post: Pick<Post, "trendTopic" | "title" | "category">, n = 1): Promise<ArticleImage[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const words = topicWords(post);
  const theme = CATEGORY_THEME[post.category] || "news";
  const alt = (post.trendTopic || post.title).slice(0, 110);
  const out: ArticleImage[] = [];
  const seen = new Set<string>();
  for (const q of [words, theme, "news india"].filter(Boolean)) {
    if (out.length >= n) break;
    const r = await pexelsSearch(key, q);
    if (r && !seen.has(r.url)) {
      seen.add(r.url);
      out.push({ url: r.url, credit: r.credit, alt });
    }
  }
  return out.slice(0, n);
}

/**
 * Insert ONE relevant image into the markdown body after the first H2 section.
 * No-op (returns body unchanged) when no PEXELS_API_KEY, no image found, or the body already has an image.
 */
export async function withArticleImage(post: Pick<Post, "trendTopic" | "title" | "category" | "content">): Promise<string> {
  const body = post.content || "";
  if (!process.env.PEXELS_API_KEY) return body;
  if (/!\[[^\]]*\]\([^)]+\)/.test(body)) return body; // already has an image
  const imgs = await articleImages(post, 1);
  if (!imgs.length) return body;
  const img = imgs[0];
  const alt = img.alt.replace(/[\[\]]/g, "");
  const block = `\n\n![${alt}](${img.url})\n\n*Photo: ${img.credit} (representative image)*\n`;

  const lines = body.split("\n");
  // Find the end of the first H2 section: the line of the next H2 after the first H2.
  let firstH2 = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      if (firstH2 === -1) {
        firstH2 = i;
      } else {
        // insert the image block before this (the second) H2
        lines.splice(i, 0, block);
        return lines.join("\n");
      }
    }
  }
  // Only one H2 (or none): append after the first H2's content, else at the top.
  if (firstH2>= 0) {
    lines.splice(firstH2 + 1, 0, block);
    return lines.join("\n");
  }
  return block + body;
}
