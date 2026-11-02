import { NextRequest, NextResponse } from "next/server";

/** Protects /admin pages. Token verification happens server-side in pages; here we only gate presence of the cookie. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!req.cookies.get("cs_admin")?.value) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
