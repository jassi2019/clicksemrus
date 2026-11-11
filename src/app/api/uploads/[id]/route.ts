import { NextRequest, NextResponse } from "next/server";
import { readUpload } from "@/lib/uploads";

/** Serves images uploaded through the page builder. Ids are unique per upload, so responses are immutable. */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const hit = await readUpload(id);
  if (!hit) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(hit.bytes), {
    status: 200,
    headers: {
      "Content-Type": hit.meta.type,
      "Content-Length": String(hit.bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ...(hit.meta.type === "image/svg+xml" ? { "Content-Security-Policy": "script-src 'none'" } : {}),
    },
  });
}
