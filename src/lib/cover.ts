import type { Post } from "./posts";

/**
 * Blog cover resolution (pure, safe for server and client).
 * Priority: generated/stored AI or stock cover -> original high-res cover -> branded cover rendered by /api/cover.
 * Google Trends thumbnails (encrypted-tbn*.gstatic.com) are tiny, so they are never used as covers.
 */

export const isLowQualityCover = (url?: string) => !url || /gstatic\.com\/images\?q=tbn/i.test(url) || /\bs(64|96|120|150)\b/.test(url);

export function brandedCoverUrl(post: Pick<Post, "title" | "category" | "source" | "slug">) {
  const q = new URLSearchParams({ t: post.title.slice(0, 120), c: post.category, k: post.source === "trend" ? "trend" : "guide", s: post.slug.slice(0, 40) });
  return `/api/cover?${q.toString()}`;
}

/** URL to use everywhere a post cover is shown. Absolute when `base` is given (for metadata). */
export function coverFor(post: Pick<Post, "title" | "category" | "source" | "slug" | "cover">, base = ""): string {
  const url = post.cover && !isLowQualityCover(post.cover) ? post.cover : brandedCoverUrl(post);
  if (!base) return url;
  return url.startsWith("http") ? url : `${base}${url}`;
}

/** Whether the shown cover is the original with a credit line. */
export const usesOriginalCover = (post: Pick<Post, "cover">) => Boolean(post.cover && !isLowQualityCover(post.cover));
