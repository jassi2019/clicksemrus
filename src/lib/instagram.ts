import { SITE } from "./site";
import { db as store } from "./db";

/**
 * Instagram feed loader for @clicksemrus.
 * Sources, in order:
 *  1. INSTAGRAM_FEED_URL     - JSON feed URL (Behold.so or similar)
 *  2. INSTAGRAM_ACCESS_TOKEN - Instagram Graph API long-lived token
 *  3. Public profile reader  - parses the public profile page (no token needed)
 * Every successful fetch is cached in Redis (key ig:feed) and served as a fallback
 * if the live source is temporarily unavailable. Next's fetch cache revalidates hourly.
 */

export type IgPost = {
  id: string;
  code: string;
  url: string;
  image: string;
  caption: string;
  type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp: string;
};

const REVALIDATE = 3600;
const CACHE_KEY = "ig:feed";
export const INSTAGRAM_HANDLE = SITE.instagram.replace(/\/+$/, "").split("/").pop() || "clicksemrus";

type GraphItem = { id: string; caption?: string; media_type?: string; media_url?: string; thumbnail_url?: string; permalink?: string; timestamp?: string };

function codeFromUrl(url: string) {
  const m = url.match(/\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : "";
}

function normalise(items: unknown[]): IgPost[] {
  return items
    .map((raw): IgPost | null => {
      if (!raw || typeof raw !== "object") return null;
      const it = raw as GraphItem & { mediaUrl?: string; thumbnailUrl?: string; mediaType?: string; sizes?: { medium?: { mediaUrl?: string } } };
      const image = it.thumbnail_url || it.thumbnailUrl || it.sizes?.medium?.mediaUrl || it.media_url || it.mediaUrl || "";
      const url = it.permalink || "";
      if (!image || !url) return null;
      const t = (it.media_type || it.mediaType || "IMAGE").toUpperCase();
      return {
        id: String(it.id),
        code: codeFromUrl(url),
        url,
        image,
        caption: (it.caption || "").slice(0, 220),
        type: t === "VIDEO" ? "VIDEO" : t === "CAROUSEL_ALBUM" ? "CAROUSEL_ALBUM" : "IMAGE",
        timestamp: it.timestamp || "",
      };
    })
    .filter((p): p is IgPost => Boolean(p));
}

/** Parse the public profile page (rendered to markdown by a reader proxy) into posts. */
function parseProfileMarkdown(md: string): IgPost[] {
  const re = /\[!\[Image \d+: ([^\]]*)\]\((https:\/\/[^)\s]+)\)\]\((https:\/\/www\.instagram\.com\/[^)]*?\/(?:p|reel)\/([A-Za-z0-9_-]+)\/?)\)/g;
  const out: IgPost[] = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    const [, alt, image, url, code] = m;
    if (seen.has(code)) continue;
    seen.add(code);
    const isVideo = /^Video by/i.test(alt) || /\/reel\//.test(url);
    // Alt text is either a real caption or "Photo by X on DATE. May be an image of ...".
    const dateMatch = alt.match(/ on ([A-Z][a-z]+ \d{1,2}, \d{4})/);
    const generic = /^(Photo|Video) by /i.test(alt);
    const caption = generic ? alt.replace(/^(Photo|Video) by .*? on [A-Z][a-z]+ \d{1,2}, \d{4}\.?\s*/i, "").replace(/^May be (an image|a video) of /i, "").trim() : alt.trim();
    out.push({
      id: code,
      code,
      url: `https://www.instagram.com/${INSTAGRAM_HANDLE}/${isVideo ? "reel" : "p"}/${code}/`,
      image,
      caption: caption.slice(0, 220),
      type: isVideo ? "VIDEO" : /carousel/i.test(image) ? "CAROUSEL_ALBUM" : "IMAGE",
      timestamp: dateMatch ? new Date(dateMatch[1]).toISOString() : "",
    });
  }
  return out;
}

async function fromFeedUrl(url: string, limit: number) {
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) return [];
  const j: unknown = await res.json();
  const items = Array.isArray(j) ? j : (j as { posts?: unknown[]; data?: unknown[] }).posts || (j as { data?: unknown[] }).data || [];
  return normalise(items).slice(0, limit);
}

async function fromGraph(token: string, limit: number) {
  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const res = await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`, { next: { revalidate: REVALIDATE } });
  if (!res.ok) return [];
  const j = (await res.json()) as { data?: unknown[] };
  return normalise(j.data || []).slice(0, limit);
}

async function fromPublicProfile(limit: number) {
  const res = await fetch(`https://r.jina.ai/https://www.instagram.com/${INSTAGRAM_HANDLE}/`, {
    headers: { Accept: "text/plain", "X-Return-Format": "markdown" },
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) return [];
  return parseProfileMarkdown(await res.text()).slice(0, limit);
}

export async function getInstagramFeed(limit = 8): Promise<IgPost[]> {
  let posts: IgPost[] = [];
  try {
    if (process.env.INSTAGRAM_FEED_URL) posts = await fromFeedUrl(process.env.INSTAGRAM_FEED_URL, limit);
    else if (process.env.INSTAGRAM_ACCESS_TOKEN) posts = await fromGraph(process.env.INSTAGRAM_ACCESS_TOKEN, limit);
    if (!posts.length) posts = await fromPublicProfile(limit);
  } catch {
    posts = [];
  }
  if (posts.length) {
    store.set(CACHE_KEY, { at: Date.now(), posts }).catch(() => {});
    return posts;
  }
  const cached = await store.get<{ at: number; posts: IgPost[] }>(CACHE_KEY).catch(() => null);
  return cached?.posts?.slice(0, limit) ?? [];
}
