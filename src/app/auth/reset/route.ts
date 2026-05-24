import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getProjectAuthCookiePrefix, isAuthCookie } from '@/lib/supabase/cookieNames';

export const GET = async (request: Request) => {
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/?cookies=cleared`);

  const cookieStore = await cookies();
  const names = new Set(cookieStore.getAll().map(({ name }) => name));

  const prefix = getProjectAuthCookiePrefix();
  if (prefix) {
    for (let i = 0; i < 50; i += 1) {
      names.add(i === 0 ? prefix : `${prefix}.${i}`);
    }
  }

  names.forEach((name) => {
    if (isAuthCookie(name)) {
      response.cookies.set(name, '', { maxAge: 0, path: '/' });
    }
  });

  return response;
};
