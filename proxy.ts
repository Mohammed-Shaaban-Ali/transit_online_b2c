import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const pathname = request.nextUrl.pathname;
  const localeGroup = routing.locales.join('|');
  const loginRegex = new RegExp(`^/(${localeGroup})/new/login/?$`);
  const loginMatch = pathname.match(loginRegex);
  const returnTo = request.nextUrl.searchParams.get('returnTo');

  if (authToken && loginMatch) {
    const locale = loginMatch[1];
    const safeReturnTo =
      returnTo && returnTo.startsWith('/') ? returnTo : `/${locale}/new`;
    const redirectUrl = new URL(safeReturnTo, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};