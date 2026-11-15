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

export async function getClientReels(username = process.env.REELS_IG_USERNAME || "liv.blameless", limit = 8, sort: "latest" | "likes" = "latest", pinned: string[] = []): Promise<Reel[]> {
  const igUser = process.env.INSTAGRAM_USER_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.WA_CLOUD_TOKEN;
  const cacheKey = `reels:${username}:${sort}:${pinned.join(",").slice(0, 80)}`;
  let reels: Reel[] = [];
  if (igUser && token) {
    try {
      const codeOf = (m: Media) => m.permalink?.match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/)?.[1] || m.id;
      const toReel = (m: Media): Reel => ({
        code: codeOf(m),
        url: m.permalink!,
        thumb: m.thumbnail_url || m.media_url!,
        video: m.media_type === "VIDEO" ? m.media_url : undefined,
        caption: (m.caption || "").replace(/\s+/g, " ").trim().slice(0, 140),
        likes: m.like_count || 0,
        comments: m.comments_count || 0,
        timestamp: m.timestamp || "",
      });
      const all: Media[] = [];
      let after: string | undefined;
      // Paginate (up to 6 pages) until every pinned code is found.
      for (let page = 0; page < (pinned.length ? 6 : 1); page++) {
        const media = `media.limit(50)${after ? `.after(${after})` : ""}{id,media_type,media_product_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count}`;
        const fields = `business_discovery.username(${username}){${media}}`;
        const res = await fetch(`https://graph.facebook.com/v21.0/${igUser}?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`, { next: { revalidate: REVALIDATE } });
        if (!res.ok) break;
        const j = (await res.json()) as { business_discovery?: { media?: { data?: Media[]; paging?: { cursors?: { after?: string } } } } };
        const data = j.business_discovery?.media?.data || [];
        all.push(...data);
        after = j.business_discovery?.media?.paging?.cursors?.after;
        const have = new Set(all.map(codeOf));
        if (!data.length || !after || pinned.every((c) => have.has(c))) break;
      }
      const usable = all.filter((m) => m.permalink && (m.thumbnail_url || m.media_url));
      const byCode = new Map(usable.map((m) => [codeOf(m), m]));
      const pinnedReels = pinned.map((c) => byCode.get(c)).filter((m): m is Media => Boolean(m)).map(toReel);
      const rest = usable
        .filter((m) => m.media_product_type === "REELS" || m.media_type === "VIDEO")
        .map(toReel)
        .filter((r) => !pinned.includes(r.code))
        .sort((a, b) => (sort === "likes" ? b.likes - a.likes : 0));
      reels = [...pinnedReels, ...rest].slice(0, Math.max(limit, pinnedReels.length));
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

/** Videos from our own Instagram account (media_url is available for owned media, so they play natively). */
export async function getOwnVideos(limit = 8): Promise<Reel[]> {
  const igUser = process.env.INSTAGRAM_USER_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.WA_CLOUD_TOKEN;
  const cacheKey = "reels:own";
  let reels: Reel[] = [];
  if (igUser && token) {
    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/${igUser}/media?fields=id,media_type,media_product_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count&limit=50&access_token=${encodeURIComponent(token)}`, { next: { revalidate: REVALIDATE } });
      if (res.ok) {
        const j = (await res.json()) as { data?: Media[] };
        reels = (j.data || [])
          .filter((m) => m.media_type === "VIDEO" && m.media_url && m.permalink)
          .map((m) => ({
            code: m.permalink!.match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/)?.[1] || m.id,
            url: m.permalink!,
            thumb: m.thumbnail_url || m.media_url!,
            video: m.media_url,
            caption: (m.caption || "").replace(/\s+/g, " ").trim().slice(0, 140),
            likes: m.like_count || 0,
            comments: m.comments_count || 0,
            timestamp: m.timestamp || "",
          }))
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
