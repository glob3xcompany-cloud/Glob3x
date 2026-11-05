import { NextResponse, type NextRequest } from "next/server";
import { isLocale, negotiateLocale } from "@/lib/i18n";

/**
 * Locale routing. A request without a locale prefix is redirected to the best available language:
 * exact browser tag, then base language, then English. A visitor who switches language explicitly is
 * remembered in a cookie so the next visit opens in that language.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) {
    const response = NextResponse.next();
    if (request.cookies.get("lang")?.value !== first) {
      response.cookies.set("lang", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return response;
  }

  const remembered = request.cookies.get("lang")?.value;
  const locale = isLocale(remembered) ? remembered : negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, sitemap/robots and any file with an extension (media, icons, fonts).
  matcher: ["/((?!_next|api|sitemap\\.xml|robots\\.txt|.*\\..*).*)"],
};
