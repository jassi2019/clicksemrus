import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { isTakeoverSlug, layoutPath, normalizeLayout, validSlug, type PageLayout } from "@/lib/builder";
import { deleteLayout, getLayout, listLayouts, saveLayout } from "@/lib/builderStore";
import { blankLayout, seedFor } from "@/lib/builderSeeds";

const unauthorized = () => NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

function revalidate(slug: string) {
  const path = layoutPath(slug);
  revalidatePath(path);
  if (path !== "/") revalidatePath("/");
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return unauthorized();
  const slug = req.nextUrl.searchParams.get("slug");
  if (slug) {
    const layout = await getLayout(slug);
    if (!layout) return bad("Not found", 404);
    return NextResponse.json({ ok: true, layout });
  }
  return NextResponse.json({ ok: true, layouts: await listLayouts() });
}

type Body = { action?: unknown; slug?: unknown; title?: unknown; layout?: unknown };

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return unauthorized();
  const b = (await req.json().catch(() => ({}))) as Body;
  const action = typeof b.action === "string" ? b.action : "save";

  if (action === "create") {
    const title = String(b.title ?? "").trim().slice(0, 140);
    const slug = String(b.slug ?? "").trim().toLowerCase();
    if (!title) return bad("Title is required");
    if (!validSlug(slug) || isTakeoverSlug(slug)) return bad("Slug must be lowercase letters, numbers and hyphens, and not a reserved route.");
    if (await getLayout(slug)) return bad("A page with this slug already exists", 409);
    const layout = await saveLayout(blankLayout(slug, title));
    return NextResponse.json({ ok: true, layout });
  }

  if (action === "seed") {
    const slug = String(b.slug ?? "").trim().toLowerCase();
    if (!isTakeoverSlug(slug)) return bad("Unknown page");
    const existing = await getLayout(slug);
    if (existing) return NextResponse.json({ ok: true, layout: existing, existed: true });
    const seed = await seedFor(slug);
    if (!seed) return bad("No seed for this page");
    return NextResponse.json({ ok: true, layout: await saveLayout(seed) });
  }

  if (action === "reseed") {
    // Replace a take-over layout with a fresh seed from the current code version (keeps status).
    const slug = String(b.slug ?? "").trim().toLowerCase();
    if (!isTakeoverSlug(slug)) return bad("Unknown page");
    const seed = await seedFor(slug);
    if (!seed) return bad("No seed for this page");
    const existing = await getLayout(slug);
    const layout = await saveLayout({ ...seed, status: existing?.status ?? "draft" });
    if (layout.status === "published") revalidate(slug);
    return NextResponse.json({ ok: true, layout });
  }

  // save / publish / unpublish all take a full layout payload.
  const incoming = normalizeLayout(b.layout);
  if (!incoming) return bad("Invalid layout");
  const current = await getLayout(incoming.slug);
  let layout: PageLayout = incoming;
  if (action === "publish") layout = { ...incoming, status: "published" };
  else if (action === "unpublish") layout = { ...incoming, status: "draft" };
  else if (action === "save") layout = { ...incoming, status: current?.status ?? "draft" };
  else return bad("Unknown action");

  await saveLayout(layout);
  if (layout.status === "published" || current?.status === "published") revalidate(layout.slug);
  return NextResponse.json({ ok: true, layout });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return unauthorized();
  const slug = req.nextUrl.searchParams.get("slug") || "";
  if (!validSlug(slug)) return bad("Invalid slug");
  const existing = await getLayout(slug);
  await deleteLayout(slug);
  if (existing?.status === "published") revalidate(slug);
  return NextResponse.json({ ok: true });
}
