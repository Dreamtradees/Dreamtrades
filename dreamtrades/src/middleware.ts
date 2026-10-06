import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Hosts that should present as SARA TRADING FX (face brand). */
const SARA_HOSTS = new Set([
  "saratradingfx.vercel.app",
  "www.saratradingfx.com",
  "saratradingfx.com",
]);

export function isSaraHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return SARA_HOSTS.has(h);
}

/**
 * On Sara's domain: send `/` to her landing and stamp every page with ?ref=sara
 * so the face-brand chrome + lead attribution stick.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isSaraHost(host)) {
    return NextResponse.next();
  }

  const { pathname, searchParams } = request.nextUrl;

  // Don't touch API / admin / static
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Root → Sara face landing
  if (pathname === "/" || pathname === "") {
    const url = request.nextUrl.clone();
    url.pathname = "/with/sara";
    return NextResponse.rewrite(url);
  }

  // Keep ref=sara on public pages so chrome + claims stay Sara-branded
  if (!searchParams.get("ref") && !pathname.startsWith("/with/") && !pathname.startsWith("/partners/")) {
    const url = request.nextUrl.clone();
    url.searchParams.set("ref", "sara");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
