import { NextRequest, NextResponse } from "next/server";
import { recordHit, recordEvent } from "@/lib/analytics";
import { isValidVid, recordVisit } from "@/lib/visitors";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function geo(req: NextRequest) {
  const dec = (v: string | null) => {
    if (!v) return "";
    try { return decodeURIComponent(v); } catch { return v; }
  };
  return { country: req.headers.get("x-vercel-ip-country") || "unknown", city: dec(req.headers.get("x-vercel-ip-city")) };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    if (typeof body.event === "string" && body.event) {
      await recordEvent(body.event.slice(0, 50));
    } else if (typeof body.path === "string" && body.path) {
      const ua = req.headers.get("user-agent") || "";
      if (/bot|crawl|spider|slurp|facebookexternalhit|preview/i.test(ua)) return NextResponse.json({ ok: true, bot: true });
      const { country, city } = geo(req);
      const path = body.path.split("?")[0].slice(0, 200);
      const referrer = str(body.referrer ?? body.ref, 120);
      const utmParts = [str(body.utm_source, 40), str(body.utm_medium, 40), str(body.utm_campaign, 60)].filter(Boolean);
      const utm = utmParts.length ? utmParts.join("/") : str(body.utm, 120);
      const device = str(body.device, 10) || "unknown";
      const jobs: Promise<unknown>[] = [recordHit({ path, ref: referrer, utm, device, country })];
      if (isValidVid(body.vid)) {
        const screen = typeof body.sw === "number" && Number.isFinite(body.sw) ? Math.round(body.sw) : undefined;
        jobs.push(recordVisit({ vid: body.vid, path, referrer, utm, device, country, city: city.slice(0, 60), screen, language: str(body.lang, 12) || undefined }));
      }
      await Promise.all(jobs);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
