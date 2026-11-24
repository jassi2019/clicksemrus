import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchAllTopics, buildTrendPost, fetchTopicTrend } from "@/lib/trending";
import { postExists, savePost, getSettings } from "@/lib/posts";
import { refreshGsc, getGscSnapshot } from "@/lib/gsc";
import { buildKeywordPost, keywordSlug } from "@/lib/keywordPost";
import { notifyIndex, submitSitemap } from "@/lib/indexing";
import { ensureCover } from "@/lib/coverGen";
import { getPost } from "@/lib/posts";
import { db } from "@/lib/db";
import { KEYWORD_QUEUE } from "@/lib/site";
import type { Opportunity } from "@/lib/gsc";
import { hasOldRedis, mergeOldRedis } from "@/lib/mergeOld";

export const maxDuration = 300;

/** Only the single top trend, and only if the last trend post is at least this old (every other day). */
const TREND_GAP_MS = 40 * 3600_000;
const TREND_LAST_KEY = "trend:lastAt";
/** Search Console queries worth an article: digital-marketing intent only, not news/entertainment queries. */
const MARKETING_QUERY = /\b(seo|google ads|ppc|meta ads|facebook ads|instagram|social media|digital marketing|content marketing|email marketing|whatsapp marketing|influencer|branding|website|landing page|ecommerce|e-commerce|shopify|lead generation|cpc|roas|backlink|google business|gmb|local seo|marketing agency|marketing cost|marketing strategy)\b/i;

/**
 * Daily growth cron (see vercel.json / .github/workflows/trending.yml). In one run:
 *  1. Google Trends India -> the single most-searched topic, every other day (`limit`, default 1)
 *  2. Keyword articles (`keywords`, default 0 = off; the owner wants one article per gap): Search Console opportunities with digital-marketing
 *     intent first, then the pan-India KEYWORD_QUEUE in site.ts. This is the ranking engine.
 *  3. Ping Google Indexing API + IndexNow for everything created, plus /blog and the sitemap
 * Protected by CRON_SECRET (Vercel sends it automatically).
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  // Manual re-index: ?pages=1 pings the Indexing API + IndexNow for the core money pages (after title/content changes).
  if (req.nextUrl.searchParams.get("pages") === "1") {
    const core = ["/", "/services", "/services/seo", "/services/paid-ads", "/services/social-media-marketing", "/services/web-design-development", "/services/ecommerce", "/services/branding-creative", "/services/automation-crm", "/pricing", "/industries", "/about", "/contact", "/case-studies", "/blog", "/sitemap.xml"];
    const indexed = await notifyIndex(core);
    await submitSitemap().catch(() => "error");
    return NextResponse.json({ ok: true, reindexed: indexed.length, indexed });
  }

  // Manual publish: ?topic=<query> writes one trend post about that topic right now (outside the
  // every-other-day gap; replaces an existing post with the same slug) and returns.
  const topic = (req.nextUrl.searchParams.get("topic") || "").trim().slice(0, 80);
  if (topic) {
    const t = await fetchTopicTrend(topic);
    if (!t) return NextResponse.json({ ok: false, error: `no news found for "${topic}"` }, { status: 404 });
    let post: Awaited<ReturnType<typeof buildTrendPost>>;
    try {
      post = await buildTrendPost(t);
    } catch (e) {
      return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 503 });
    }
    const existed = await postExists(post.slug);
    await savePost(post);
    await db.set(TREND_LAST_KEY, Date.now()); // a manual post counts: the next automatic one waits the full gap
    await ensureCover(post, true);
    revalidatePath("/"); revalidatePath("/blog"); revalidatePath(`/blog/${post.slug}`); revalidatePath("/sitemap.xml");
    const indexed = await notifyIndex([`/blog/${post.slug}`, "/blog", "/sitemap.xml"]);
    return NextResponse.json({ ok: true, created: [post.slug], title: post.title, notes: [existed ? "replaced existing post" : "manual topic post"], indexed });
  }

  const settings = await getSettings();
  const created: string[] = [];
  const notes: string[] = [];
  const startedAt = Date.now();
  const inBudget = () => Date.now() - startedAt < 200_000; // stay inside the function budget

  // 1. Trend post: one per run, skipped while the previous one is fresher than TREND_GAP_MS
  if (settings.autoPublishTrends !== false) {
    const limit = Number(req.nextUrl.searchParams.get("limit") || 1);
    const lastAt = Number((await db.get<number>(TREND_LAST_KEY).catch(() => 0)) || 0);
    if (Date.now() - lastAt < TREND_GAP_MS) {
      notes.push(`trend skipped: last one ${Math.round((Date.now() - lastAt) / 3600_000)}h ago`);
    } else {
      const trends = await fetchAllTopics(settings.trendGeo || "IN", 10); // traffic-ranked, top first
      let made = 0;
      for (const t of trends) {
        if (made >= limit || !inBudget()) break;
        let post: Awaited<ReturnType<typeof buildTrendPost>>;
        try {
          post = await buildTrendPost(t);
        } catch (e) {
          notes.push(`trend "${t.title}" skipped: ${(e as Error).message.slice(0, 80)}`);
          continue;
        }
        if (await postExists(post.slug)) continue;
        await savePost(post);
        created.push(post.slug);
        made++;
      }
      if (made) await db.set(TREND_LAST_KEY, Date.now());
      notes.push(`trends seen: ${trends.length}, written: ${made}`);
    }
  } else notes.push("trend auto-publish disabled");

  // 2. Keyword articles: GSC marketing queries first, then the planned queue
  // Owner's rule (24 Nov 2026): ONE article per gap, the top India trend. Keyword articles only when a run asks explicitly.
  const kwLimit = Number(req.nextUrl.searchParams.get("keywords") || 0);
  let written = 0;
  const writeKeyword = async (o: Opportunity) => {
    const slug = keywordSlug(o.query);
    if (await postExists(slug)) return false;
    const post = await buildKeywordPost(o);
    await savePost(post);
    created.push(post.slug);
    written++;
    return true;
  };
  try {
    const snap = (await refreshGsc()) || (await getGscSnapshot());
    if (snap) {
      for (const o of snap.opportunities) {
        if (written >= kwLimit || !inBudget()) break;
        if (!MARKETING_QUERY.test(o.query)) continue; // news/entertainment queries are not what we rank for
        if (o.kind === "striking" && o.position < 8) continue; // already near page one; leave the existing page alone
        await writeKeyword(o);
      }
      notes.push(`gsc opportunities: ${snap.opportunities.length}, keyword posts from gsc: ${written}`);
    } else notes.push("gsc: not configured");
  } catch (e) {
    notes.push(`gsc error: ${(e as Error).message.slice(0, 120)}`);
  }
  const fromGsc = written;
  for (const q of KEYWORD_QUEUE) {
    if (written >= kwLimit || !inBudget()) break;
    await writeKeyword({ query: q, page: "", clicks: 0, impressions: 0, ctr: 0, position: 0, recentImpressions: 0, kind: "uncovered", score: 0 });
  }
  notes.push(`keyword posts from queue: ${written - fromGsc}`);

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

  // 4. Bring back the previous database's data once its quota resets (idempotent; skipped while it errors)
  if (hasOldRedis() && inBudget()) {
    const m = await mergeOldRedis({ maxKeys: 400, budgetMs: 60_000 }).catch((e: Error) => ({ status: "error" as const, error: e.message.slice(0, 120) }));
    notes.push(`old redis merge: ${JSON.stringify(m).slice(0, 300)}`);
    if ("copied" in m && m.copied) {
      const merged = (m.sample || []).filter((k) => k.startsWith("post:")).map((k) => `/blog/${k.slice(5)}`);
      if (merged.length) await notifyIndex([...merged, "/blog", "/sitemap.xml"]).catch(() => []);
    }
  }

  return NextResponse.json({ ok: true, created, notes, indexed });
}
