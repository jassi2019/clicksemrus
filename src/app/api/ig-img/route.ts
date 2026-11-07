import { NextResponse } from "next/server";

/**
 * Stable image proxy for Instagram posts: /api/ig-img?c=<shortcode>
 * Instagram CDN URLs expire; the /media/ endpoint always resolves to the current image.
 * Cached at the edge for a day.
 */
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("c") || "";
  if (!/^[A-Za-z0-9_-]{5,20}$/.test(code)) return new NextResponse("Bad code", { status: 400 });
  const res = await fetch(`https://www.instagram.com/p/${code}/media/?size=l`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36" },
    redirect: "follow",
    next: { revalidate: 86400 },
  });
  const type = res.headers.get("content-type") || "";
  if (!res.ok || !type.startsWith("image/")) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(await res.arrayBuffer(), {
    headers: { "content-type": type, "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
