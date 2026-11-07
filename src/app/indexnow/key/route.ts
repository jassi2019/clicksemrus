import { indexNowKey } from "@/lib/indexing";

/** IndexNow key file (keyLocation). Set INDEXNOW_KEY in Vercel. */
export function GET() {
  const key = indexNowKey();
  return new Response(key || "not-configured", { status: key ? 200 : 404, headers: { "content-type": "text/plain" } });
}
