import { SITE } from "./site";

/**
 * Instagram feed loader.
 * Sources, in order:
 *  1. INSTAGRAM_FEED_URL  - a JSON feed URL (e.g. Behold.so / any service that returns posts)
 *  2. INSTAGRAM_ACCESS_TOKEN - Instagram Graph API (Instagram Login) long-lived user token
 * Results are cached by Next's fetch cache for an hour. Returns [] when nothing is configured.
 */

export type IgPost = {
  id: string;
  url: string;
  image: string;
  caption: string;
  type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp: string;
};

const REVALIDATE = 3600;

type GraphItem = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

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
        url,
        image,
        caption: (it.caption || "").slice(0, 220),
        type: t === "VIDEO" ? "VIDEO" : t === "CAROUSEL_ALBUM" ? "CAROUSEL_ALBUM" : "IMAGE",
        timestamp: it.timestamp || "",
      };
    })
    .filter((p): p is IgPost => Boolean(p));
}

export async function getInstagramFeed(limit = 8): Promise<IgPost[]> {
  const feedUrl = process.env.INSTAGRAM_FEED_URL;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  try {
    if (feedUrl) {
      const res = await fetch(feedUrl, { next: { revalidate: REVALIDATE } });
      if (!res.ok) return [];
      const j: unknown = await res.json();
      const items = Array.isArray(j) ? j : (j as { posts?: unknown[]; data?: unknown[] }).posts || (j as { data?: unknown[] }).data || [];
      return normalise(items).slice(0, limit);
    }
    if (token) {
      const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
      const res = await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`, { next: { revalidate: REVALIDATE } });
      if (!res.ok) return [];
      const j = (await res.json()) as { data?: unknown[] };
      return normalise(j.data || []).slice(0, limit);
    }
  } catch {
    /* network or parse error: fall through to empty */
  }
  return [];
}

export const INSTAGRAM_HANDLE = SITE.instagram.replace(/\/+$/, "").split("/").pop() || "clicksemrus";
