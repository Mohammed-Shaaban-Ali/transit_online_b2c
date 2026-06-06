import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import {
  SUPPORTED_COUNTRIES,
  DEFAULT_COUNTRY,
  Country,
} from "./config/countries";
import { COUNTRY_COOKIE } from "./constants";

const intlMiddleware = createMiddleware(routing);

// ─── helpers ────────────────────────────────────────────────────────────────

const LOCALE_PATTERN = new RegExp(
  `^/(${routing.locales.join("|")})(/.*)?$`
);

/**
 * Parse the pathname and return:
 *  - locale  : the next-intl locale segment ("ar" | "en")
 *  - country : a valid country code when present in the URL ("eg" | "sa" | null)
 *  - restPath: the path after locale (and after country when present)
 *
 * Returns null when the URL doesn't start with a supported locale.
 */
function parseLocaleCountry(pathname: string) {
  const match = pathname.match(LOCALE_PATTERN);
  if (!match) return null;

  const locale = match[1];
  const afterLocale = match[2] ?? "/";
  const segments = afterLocale.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { locale, country: null as Country | null, restPath: "/" };
  }

  const first = segments[0];
  if (SUPPORTED_COUNTRIES.includes(first as Country)) {
    const rest = "/" + segments.slice(1).join("/");
    return {
      locale,
      country: first as Country,
      restPath: rest === "/" || rest === "" ? "/" : rest,
    };
  }

  return { locale, country: null as Country | null, restPath: afterLocale };
}

// ─── middleware ──────────────────────────────────────────────────────────────

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const parsed = parseLocaleCountry(pathname);

  // URL has no locale prefix — let next-intl handle the redirect to default locale
  if (!parsed) {
    return intlMiddleware(request);
  }

  const { locale, country, restPath } = parsed;

  if (country) {
    // ── Valid country in URL ─────────────────────────────────────────────────
    // Redirect authenticated users away from the login page
    const authToken = request.cookies.get("auth-token")?.value;
    if (authToken && restPath === "/login") {
      const returnTo = request.nextUrl.searchParams.get("returnTo");
      const safeReturnTo =
        returnTo && returnTo.startsWith("/")
          ? returnTo
          : `/${locale}/${country}`;
      return NextResponse.redirect(new URL(safeReturnTo, request.url));
    }

    // Internally rewrite the URL to remove the country segment so that
    // Next.js can route it to the correct page under app/[locale]/...
    // The browser URL keeps showing /<locale>/<country>/...
    const rewrittenUrl = request.nextUrl.clone();
    rewrittenUrl.pathname =
      `/${locale}` + (restPath === "/" ? "" : restPath);

    const response = NextResponse.rewrite(rewrittenUrl);

    // Persist the chosen country for future visits
    response.cookies.set(COUNTRY_COOKIE, country, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
    });

    return response;
  }

  // ── No country in URL — redirect to add it ───────────────────────────────
  const saved = request.cookies.get(COUNTRY_COOKIE)?.value;
  const targetCountry: Country =
    saved && SUPPORTED_COUNTRIES.includes(saved as Country)
      ? (saved as Country)
      : DEFAULT_COUNTRY;

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname =
    `/${locale}/${targetCountry}` + (restPath === "/" ? "" : restPath);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  // Match all pathnames except:
  // - /api, /trpc, /_next, /_vercel
  // - paths containing a dot (e.g. favicon.ico)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
