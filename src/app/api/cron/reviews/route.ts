import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";
import { REVIEWS_KEY, type Review, type ReviewData } from "@/lib/reviews";

export const maxDuration = 30;

type PlaceReview = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
  time?: number;
};

type PlaceDetails = {
  status?: string;
  result?: { rating?: number; user_ratings_total?: number; reviews?: PlaceReview[] };
};

/**
 * Daily cron (see vercel.json). Fetches Google Place Details and caches reviews in Redis.
 * Protected by CRON_SECRET exactly like /api/cron/trending.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = SITE.googlePlaceId;
  if (!key || !placeId) return NextResponse.json({ ok: true, skipped: "GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set" });

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "rating,user_ratings_total,reviews");
  url.searchParams.set("reviews_sort", "newest");
  url.searchParams.set("key", key);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ ok: false, error: `Places API ${res.status}` }, { status: 502 });
  const json = (await res.json()) as PlaceDetails;
  if (json.status !== "OK" || !json.result) return NextResponse.json({ ok: false, error: json.status || "No result" }, { status: 502 });

  const reviews: Review[] = (json.result.reviews || [])
    .filter((r) => (r.rating || 0) >= 4 && (r.text || "").trim().length > 0)
    .map((r, i) => ({
      id: `g${r.time || i}`,
      name: (r.author_name || "Google user").slice(0, 60),
      meta: "Google review",
      rating: r.rating || 5,
      relative: r.relative_time_description || "",
      text: (r.text || "").slice(0, 400),
      photo: r.profile_photo_url,
    }));

  const data: ReviewData = {
    rating: json.result.rating || 5,
    total: json.result.user_ratings_total || reviews.length,
    reviews,
    source: "google",
    fetchedAt: new Date().toISOString(),
  };
  if (reviews.length > 0) await db.set(REVIEWS_KEY, data);
  revalidatePath("/");
  return NextResponse.json({ ok: true, cached: reviews.length, rating: data.rating, total: data.total });
}
