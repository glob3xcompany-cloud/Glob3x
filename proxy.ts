import { NextResponse, type NextRequest } from "next/server";
import { isLocale, negotiateLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const locale = negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // "/" is listed on its own because the basePath-prefixed matcher below only covers "/reeds/…".
  // The second entry skips Next internals, API routes and any file with an extension.
  matcher: ["/", "/((?!_next|api|.*\\..*).*)"],
};
