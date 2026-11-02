import { NextRequest, NextResponse } from "next/server";
import { checkPassword, makeToken, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!checkPassword(String(password || ""))) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, makeToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
