import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabasePublicEnv } from '@/lib/env';

export const createClientFromRequest = async (request: Request) => {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabasePublicEnv();
  const authorization = request.headers.get('Authorization');

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Route Handler — ignore when response already started
        }
      },
    },
    global: authorization ? { headers: { Authorization: authorization } } : undefined,
  });
};
