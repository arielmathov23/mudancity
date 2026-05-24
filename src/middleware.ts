import { type NextRequest, NextResponse } from 'next/server';
import { isAuthCookie } from '@/lib/supabase/cookieNames';
import { updateSession } from '@/lib/supabase/middleware';

const PROTECTED_PREFIXES = ['/owner', '/mi-mudanza', '/mis-ofertas', '/onboarding', '/cuenta', '/perfil'];

/** Redirect to reset before Node's default ~16KB header limit triggers HTTP 431. */
const AUTH_COOKIE_BYTE_LIMIT = 8_000;
const AUTH_COOKIE_COUNT_LIMIT = 8;

const getAuthCookieStats = (request: NextRequest) => {
  const authCookies = request.cookies.getAll().filter((c) => isAuthCookie(c.name));
  const bytes = authCookies.reduce((sum, c) => sum + c.name.length + (c.value?.length ?? 0), 0);
  return { authCookies, bytes, count: authCookies.length };
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/auth/reset')) {
    return NextResponse.next();
  }

  const { bytes, count } = getAuthCookieStats(request);
  if (bytes > AUTH_COOKIE_BYTE_LIMIT || count > AUTH_COOKIE_COUNT_LIMIT) {
    return NextResponse.redirect(new URL('/auth/reset', request.url));
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const response = await updateSession(request);

  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => isAuthCookie(c.name));

  if (!hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
