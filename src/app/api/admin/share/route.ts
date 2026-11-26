import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPost } from "@/lib/posts";
import { makeShareKit } from "@/lib/social";

export const maxDuration = 60;

/** POST {slug}: (re)generate the social sharing kit for one article. */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { slug } = (await req.json().catch(() => ({}))) as { slug?: string };
  const post = slug ? await getPost(slug, true) : null;
  if (!post) return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
  try {
    const kit = await makeShareKit(post);
    return kit ? NextResponse.json({ ok: true, kit }) : NextResponse.json({ ok: false, error: "AI writer returned nothing, try again" }, { status: 502 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message.slice(0, 200) }, { status: 502 });
  }
}
