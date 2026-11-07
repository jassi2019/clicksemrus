import { indexNowKey } from "@/lib/indexing";

/** IndexNow key file, served at /indexnow/<key>.txt (and /indexnow/key for convenience). */
export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const key = indexNowKey();
  const ok = key && (file === "key" || file === `${key}.txt` || file === key);
  return new Response(ok ? key : "not found", { status: ok ? 200 : 404, headers: { "content-type": "text/plain; charset=utf-8" } });
}
