import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getSettings, saveSettings, type Settings } from "@/lib/posts";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, settings: await getSettings() });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const b = (await req.json()) as Settings;
  const clean: Settings = {
    gaId: String(b.gaId || "").trim().slice(0, 30),
    metaPixel: String(b.metaPixel || "").trim().slice(0, 30),
    phone: String(b.phone || "").trim().slice(0, 30),
    whatsapp: String(b.whatsapp || "").replace(/\D/g, "").slice(0, 15),
    ownerWhatsapp: String(b.ownerWhatsapp || "").replace(/\D/g, "").slice(0, 15),
    email: String(b.email || "").trim().slice(0, 120),
    address: String(b.address || "").trim().slice(0, 200),
    announcement: String(b.announcement || "").trim().slice(0, 160),
    autoPublishTrends: b.autoPublishTrends !== false,
    trendGeo: String(b.trendGeo || "IN").toUpperCase().slice(0, 2),
    showStatsNote: b.showStatsNote === true,
  };
  await saveSettings(clean);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, settings: clean });
}
