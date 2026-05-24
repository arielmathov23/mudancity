import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_NEXT_COOKIE_NAME } from '@/constants/auth';
import { sanitizeNextPath } from '@/lib/auth/redirect';

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const cookieStore = await cookies();
  const nextFromCookie = cookieStore.get(AUTH_NEXT_COOKIE_NAME)?.value;
  const next = sanitizeNextPath(
    nextFromCookie ? decodeURIComponent(nextFromCookie) : searchParams.get('next'),
  );

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);
  response.cookies.delete(AUTH_NEXT_COOKIE_NAME);
  return response;
};
