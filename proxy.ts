import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {

  // Otherwise, proceed with next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes (`/api/*`)
  // - Next.js internals (`/_next/*`)
  // - Vercel internals (`/_vercel/*`)
  // - Static files (files with extensions like `.ico`, `.png`, `.jpg`, etc.)
  // - Files in the public folder (favicon, robots.txt, sitemap.xml, etc.)
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Match root path to handle locale detection
    "/",
  ],
};
