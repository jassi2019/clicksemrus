import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { blocksFor, getOverrides, isContentPage, pathsFor, saveContent } from "@/lib/pageContent";

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const page = req.nextUrl.searchParams.get("page") || "";
  if (!isContentPage(page)) return NextResponse.json({ ok: false, error: "Unknown page" }, { status: 404 });
  return NextResponse.json({ ok: true, page, blocks: blocksFor(page), overrides: await getOverrides(page) });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { page?: unknown; values?: unknown };
  const page = typeof b.page === "string" ? b.page : "";
  if (!isContentPage(page)) return NextResponse.json({ ok: false, error: "Unknown page" }, { status: 400 });
  const values = b.values && typeof b.values === "object" ? (b.values as Record<string, unknown>) : {};
  const saved = await saveContent(page, values);
  if (page === "global") revalidatePath("/", "layout");
  else for (const p of pathsFor(page)) revalidatePath(p);
  return NextResponse.json({ ok: true, overrides: saved });
}
