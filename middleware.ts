import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/locales";
import { getLocaleFromAcceptLanguage, getLocaleFromPathname } from "@/lib/i18n/routing";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const localeInPath = getLocaleFromPathname(pathname);

  if (pathname === "/") {
    const detected = getLocaleFromAcceptLanguage(
      request.headers.get("accept-language"),
    );
    const nextLocale = isLocale(detected) ? detected : defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${nextLocale}`;
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", nextLocale, { path: "/" });
    return response;
  }

  if (!localeInPath) {
    const detected = getLocaleFromAcceptLanguage(
      request.headers.get("accept-language"),
    );
    const nextLocale = isLocale(detected) ? detected : defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${nextLocale}${pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", nextLocale, { path: "/" });
    return response;
  }

  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", localeInPath, { path: "/" });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
