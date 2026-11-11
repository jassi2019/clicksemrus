import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchTrends, buildTrendPost } from "@/lib/trending";
import { postExists, savePost, getSettings } from "@/lib/posts";
import { refreshGsc, getGscSnapshot } from "@/lib/gsc";
import { buildKeywordPost, keywordSlug } from "@/lib/keywordPost";
import { notifyIndex, submitSitemap } from "@/lib/indexing";
import { ensureCover } from "@/lib/coverGen";
import { getPost } from "@/lib/posts";

export const maxDuration = 300;

/**
 * Daily growth cron (see vercel.json). In one run:
 *  1. Google Trends India -> trend posts
 *  2. Search Console -> refresh keyword opportunities -> keyword posts for the best uncovered queries
 *  3. Ping Google Indexing API + IndexNow for everything created, plus /blog and the sitemap
 * Protected by CRON_SECRET (Vercel sends it automatically).
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const settings = await getSettings();
  const created: string[] = [];
  const notes: string[] = [];

  // 1. Trend posts
  if (settings.autoPublishTrends !== false) {
    const trends = await fetchTrends(settings.trendGeo || "IN");
    const limit = Number(req.nextUrl.searchParams.get("limit") || 3);
    for (const t of trends.slice(0, limit)) {
      const post = await buildTrendPost(t);
      if (await postExists(post.slug)) continue;
      await savePost(post);
      created.push(post.slug);
    }
    notes.push(`trends seen: ${trends.length}`);
  } else notes.push("trend auto-publish disabled");

  // 2. Search Console opportunities -> keyword posts
  try {
    const snap = (await refreshGsc()) || (await getGscSnapshot());
    if (snap) {
      const kwLimit = Number(req.nextUrl.searchParams.get("keywords") || settings.keywordPostsPerDay || 2);
      let written = 0;
      for (const o of snap.opportunities) {
        if (written >= kwLimit) break;
        if (o.kind === "striking" && o.position < 8) continue; // already near page one; leave the existing page alone
        const slug = keywordSlug(o.query);
        if (await postExists(slug)) continue;
        const post = await buildKeywordPost(o);
        await savePost(post);
        created.push(post.slug);
        written++;
      }
      notes.push(`gsc opportunities: ${snap.opportunities.length}, keyword posts: ${written}`);
    } else notes.push("gsc: not configured");
  } catch (e) {
    notes.push(`gsc error: ${(e as Error).message.slice(0, 120)}`);
  }

  // Covers for everything created this run (AI / stock when keys exist, else branded render)
  for (const slug of created) {
    const p = await getPost(slug, true);
    if (p) await ensureCover(p);
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");

  // 3. Indexing pings
  const indexed = created.length ? await notifyIndex([...created.map((s) => `/blog/${s}`), "/blog", "/sitemap.xml"]) : [];

  const sitemap = await submitSitemap().catch((e: Error) => `error: ${e.message.slice(0, 80)}`);
  notes.push(`sitemap submit: ${sitemap}`);

  return NextResponse.json({ ok: true, created, notes, indexed });
}
