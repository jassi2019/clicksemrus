import { db } from "./db";

/**
 * Relevant stock photos for service / industry / location pages via Pexels (free API key).
 * Results are cached in Redis for 30 days so pages stay fast and ISR-friendly.
 * Returns null when PEXELS_API_KEY is not set, so callers fall back to illustrations.
 */

export type StockPhoto = { url: string; alt: string; credit: string; creditUrl: string; w: number; h: number };

const TTL_MS = 30 * 86400e3;

export async function stockPhoto(query: string, opts: { orientation?: "landscape" | "portrait" | "square"; index?: number } = {}): Promise<StockPhoto | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  const orientation = opts.orientation || "landscape";
  const cacheKey = `stock:${orientation}:${query.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80)}`;
  try {
    const cached = await db.get<{ at: number; photos: StockPhoto[] }>(cacheKey);
    if (cached && Date.now() - cached.at < TTL_MS && cached.photos.length) return cached.photos[(opts.index || 0) % cached.photos.length];
  } catch {}
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=6&size=large`, {
      headers: { Authorization: key },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { photos?: { src: { large2x: string; large: string }; alt?: string; photographer: string; photographer_url: string; width: number; height: number }[] };
    const photos: StockPhoto[] = (j.photos || []).map((p) => ({ url: p.src.large2x || p.src.large, alt: p.alt || query, credit: p.photographer, creditUrl: p.photographer_url, w: p.width, h: p.height }));
    if (!photos.length) return null;
    db.set(cacheKey, { at: Date.now(), photos }).catch(() => {});
    return photos[(opts.index || 0) % photos.length];
  } catch {
    return null;
  }
}

export const hasStockImages = () => Boolean(process.env.PEXELS_API_KEY);
