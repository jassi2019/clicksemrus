import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { refreshGsc, getGscSnapshot } from "@/lib/gsc";
import { notifyIndex, indexLog, inspectUrl, indexNowKey, submitSitemap } from "@/lib/indexing";
import { hasGoogleAuth } from "@/lib/google";
import { hasAiWriter, generateJson, aiProviderLabel } from "@/lib/llm";
import { buildKeywordPost, keywordSlug } from "@/lib/keywordPost";
import { postExists, savePost, getAllPosts } from "@/lib/posts";
import { db } from "@/lib/db";
import { ensureCover, coverProvider } from "@/lib/coverGen";

export const maxDuration = 300;

/** GET: snapshot + index log + config status. POST {action}: refresh | index(urls) | inspect(url) | write(query) | indexAll */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const [snapshot, log, aiError] = await Promise.all([getGscSnapshot(), indexLog(60), db.get("ai:lastError").catch(() => null)]);
  return NextResponse.json({ ok: true, snapshot, log, aiError, config: { google: hasGoogleAuth(), indexnow: Boolean(indexNowKey()), ai: hasAiWriter(), covers: coverProvider() } });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { action?: string; urls?: string[]; url?: string; query?: string };
  try {
    if (b.action === "aitest") {
      const t0 = Date.now();
      try {
        const r = await generateJson<{ ok: boolean; note?: string }>("Respond with JSON only.", 'Return {"ok": true, "note": "hello from " + the model name you are}');
        return NextResponse.json({ ok: true, provider: aiProviderLabel(), ms: Date.now() - t0, result: r });
      } catch (e) {
        return NextResponse.json({ ok: false, provider: aiProviderLabel(), ms: Date.now() - t0, error: (e as Error).message.slice(0, 400) });
      }
    }
    if (b.action === "refresh") {
      const snap = await refreshGsc();
      return NextResponse.json({ ok: Boolean(snap), snapshot: snap, error: snap ? undefined : "Search Console not configured or no access" });
    }
    if (b.action === "index" && b.urls?.length) {
      return NextResponse.json({ ok: true, indexed: await notifyIndex(b.urls.slice(0, 50)) });
    }
    if (b.action === "sitemap") {
      const r = await submitSitemap();
      return NextResponse.json({ ok: r === "ok", sitemap: r, error: r === "ok" ? undefined : r });
    }
    if (b.action === "covers") {
      const posts = await getAllPosts({ includeDrafts: true });
      let done = 0, skipped = 0;
      for (const p of posts.slice(0, 40)) {
        const r = await ensureCover(p, Boolean(b.url === "force"));
        if (r) done++; else skipped++;
      }
      revalidatePath("/blog"); revalidatePath("/");
      const err = await db.get<{ message: string; slug: string }>("cover:lastError").catch(() => null);
      return NextResponse.json({ ok: true, done, skipped, provider: coverProvider(), lastError: err });
    }
    if (b.action === "indexAll") {
      const posts = await getAllPosts();
      const urls = ["/", "/blog", "/sitemap.xml", ...posts.slice(0, 100).map((p) => `/blog/${p.slug}`)];
      return NextResponse.json({ ok: true, indexed: await notifyIndex(urls) });
    }
    if (b.action === "inspect" && b.url) {
      const r = await inspectUrl(b.url);
      return NextResponse.json({ ok: Boolean(r), result: r, error: r ? undefined : "URL Inspection not available (needs Search Console access)" });
    }
    if (b.action === "write" && b.query) {
      const snap = await getGscSnapshot();
      const o = snap?.opportunities.find((x) => x.query === b.query) || { query: b.query, page: "", clicks: 0, impressions: 0, ctr: 0, position: 0, recentImpressions: 0, kind: "uncovered" as const, score: 0 };
      const slug = keywordSlug(o.query);
      if (await postExists(slug)) return NextResponse.json({ ok: false, error: `Post already exists: /blog/${slug}` });
      const post = await buildKeywordPost(o);
      await savePost(post);
      await ensureCover(post);
      revalidatePath("/blog"); revalidatePath(`/blog/${post.slug}`); revalidatePath("/");
      const indexed = await notifyIndex([`/blog/${post.slug}`, "/blog"]);
      return NextResponse.json({ ok: true, slug: post.slug, indexed });
    }
    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message.slice(0, 200) }, { status: 500 });
  }
}
