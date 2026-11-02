import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchTrends, buildTrendPost } from "@/lib/trending";
import { postExists, savePost, getSettings } from "@/lib/posts";

export const maxDuration = 60;

/**
 * Daily cron (see vercel.json). Fetches Google Trends India, writes blog posts for the
 * top trends and stores them. Protected by CRON_SECRET (Vercel sends it automatically).
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const settings = await getSettings();
  if (settings.autoPublishTrends === false) return NextResponse.json({ ok: true, skipped: "auto-publish disabled" });

  const trends = await fetchTrends(settings.trendGeo || "IN");
  const limit = Number(req.nextUrl.searchParams.get("limit") || 3);
  const created: string[] = [];
  for (const t of trends.slice(0, limit)) {
    const post = await buildTrendPost(t);
    if (await postExists(post.slug)) continue;
    await savePost(post);
    created.push(post.slug);
  }
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true, created, trendsSeen: trends.length });
}
