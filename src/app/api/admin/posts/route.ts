import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { savePost, deletePost, getAllPosts, type Post } from "@/lib/posts";
import { notifyIndex } from "@/lib/indexing";

async function guard() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const g = await guard();
  if (g) return g;
  return NextResponse.json({ ok: true, posts: await getAllPosts({ includeDrafts: true }) });
}

export async function POST(req: NextRequest) {
  const g = await guard();
  if (g) return g;
  const b = (await req.json()) as Partial<Post>;
  if (!b.title || !b.content) return NextResponse.json({ ok: false, error: "Title and content required" }, { status: 400 });
  const post: Post = {
    slug: b.slug || "",
    title: b.title,
    excerpt: b.excerpt || b.content.slice(0, 160),
    content: b.content,
    category: b.category || "SEO",
    tags: Array.isArray(b.tags) ? b.tags : String(b.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    cover: b.cover || undefined,
    coverCredit: b.coverCredit,
    status: b.status === "draft" ? "draft" : "published",
    publishedAt: b.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: b.author || "ClickSemrus Team",
    seoTitle: b.seoTitle,
    seoDescription: b.seoDescription,
    source: (b.source as Post["source"]) || "manual",
    trendTopic: b.trendTopic,
    trendTraffic: b.trendTraffic,
    outbound: b.outbound,
  };
  const saved = await savePost(post);
  revalidatePath("/blog");
  revalidatePath(`/blog/${saved.slug}`);
  revalidatePath("/");
  const indexed = saved.status === "published" ? await notifyIndex([`/blog/${saved.slug}`, "/blog", "/sitemap.xml"]) : [];
  return NextResponse.json({ ok: true, post: saved, indexed });
}

export async function DELETE(req: NextRequest) {
  const g = await guard();
  if (g) return g;
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ ok: false }, { status: 400 });
  await deletePost(slug);
  revalidatePath("/blog");
  return NextResponse.json({ ok: true });
}
