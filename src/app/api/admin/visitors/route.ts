import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getVisitorOverview } from "@/lib/visitors";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const data = await getVisitorOverview();
  return NextResponse.json({ ok: true, ...data }, { headers: { "cache-control": "no-store" } });
}
