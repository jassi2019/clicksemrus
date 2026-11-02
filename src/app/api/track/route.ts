import { NextRequest, NextResponse } from "next/server";
import { recordHit, recordEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.event && typeof body.event === "string") {
      await recordEvent(body.event.slice(0, 50));
    } else if (body.path && typeof body.path === "string") {
      const ua = req.headers.get("user-agent") || "";
      if (/bot|crawl|spider|slurp|facebookexternalhit|preview/i.test(ua)) return NextResponse.json({ ok: true, bot: true });
      await recordHit({
        path: body.path,
        ref: body.ref || "",
        utm: body.utm || "",
        device: body.device || "unknown",
        country: req.headers.get("x-vercel-ip-country") || "unknown",
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
