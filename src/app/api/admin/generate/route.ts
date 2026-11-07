import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { fetchTrends, buildTrendPost } from "@/lib/trending";
import { savePost, postExists } from "@/lib/posts";
import { hasAiWriter } from "@/lib/llm";

export const maxDuration = 300;

/** GET: list current trends. POST {title} : generate + save a post for that trend (or top N). */
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const geo = req.nextUrl.searchParams.get("geo") || "IN";
  const trends = await fetchTrends(geo);
  return NextResponse.json({ ok: true, trends });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const trends = await fetchTrends(b.geo || "IN");
  const pick = b.title ? trends.filter((t) => t.title === b.title) : trends.slice(0, Number(b.limit || 3));
  const created: string[] = [];
  const skipped: string[] = [];
  for (const t of pick) {
    const post = await buildTrendPost(t);
    if (!b.force && (await postExists(post.slug))) { skipped.push(post.slug); continue; }
    await savePost(post);
    created.push(post.slug);
  }
  revalidatePath("/");
  revalidatePath("/blog");
  return NextResponse.json({ ok: true, created, skipped, ai: hasAiWriter() });
}
