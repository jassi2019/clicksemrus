import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coverKey, type StoredCover } from "@/lib/coverGen";

/** Serves an AI-generated cover stored in Redis: /api/cover-img/<slug> */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return new NextResponse("Bad slug", { status: 400 });
  const c = await db.get<StoredCover>(coverKey(slug)).catch(() => null);
  if (!c?.b64) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(Buffer.from(c.b64, "base64"), {
    headers: { "content-type": c.mime || "image/jpeg", "cache-control": "public, s-maxage=31536000, max-age=86400, immutable" },
  });
}
