import { db } from "./db";

/**
 * Reels made for a client, pulled from their public Instagram via the Graph API
 * "business discovery" edge (any Business/Creator account), using our own IG user id + Meta token.
 * Cached by Next fetch for an hour; last good result kept in Redis as a fallback.
 */

export type Reel = {
  code: string;
  url: string;
  thumb: string;
  video?: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
};

const REVALIDATE = 3600;

type Media = { id: string; media_type?: string; media_product_type?: string; media_url?: string; thumbnail_url?: string; permalink?: string; caption?: string; timestamp?: string; like_count?: number; comments_count?: number };

export async function getClientReels(username = process.env.REELS_IG_USERNAME || "liv.blameless", limit = 8, sort: "latest" | "likes" = "latest"): Promise<Reel[]> {
  const igUser = process.env.INSTAGRAM_USER_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.WA_CLOUD_TOKEN;
  const cacheKey = `reels:${username}:${sort}`;
  let reels: Reel[] = [];
  if (igUser && token) {
    try {
      const fields = `business_discovery.username(${username}){media.limit(40){id,media_type,media_product_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count}}`;
      const res = await fetch(`https://graph.facebook.com/v21.0/${igUser}?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`, { next: { revalidate: REVALIDATE } });
      if (res.ok) {
        const j = (await res.json()) as { business_discovery?: { media?: { data?: Media[] } } };
        reels = (j.business_discovery?.media?.data || [])
          .filter((m) => (m.media_product_type === "REELS" || m.media_type === "VIDEO") && m.permalink && (m.thumbnail_url || m.media_url))
          .map((m) => ({
            code: m.permalink!.match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/)?.[1] || m.id,
            url: m.permalink!,
            thumb: m.thumbnail_url || m.media_url!,
            video: m.media_type === "VIDEO" ? m.media_url : undefined,
            caption: (m.caption || "").replace(/\s+/g, " ").trim().slice(0, 140),
            likes: m.like_count || 0,
            comments: m.comments_count || 0,
            timestamp: m.timestamp || "",
          }))
          .sort((a, b) => (sort === "likes" ? b.likes - a.likes : 0))
          .slice(0, limit);
      }
    } catch {
      reels = [];
    }
  }
  if (reels.length) {
    db.set(cacheKey, { at: Date.now(), reels }).catch(() => {});
    return reels;
  }
  const cached = await db.get<{ at: number; reels: Reel[] }>(cacheKey).catch(() => null);
  return cached?.reels?.slice(0, limit) ?? [];
}
