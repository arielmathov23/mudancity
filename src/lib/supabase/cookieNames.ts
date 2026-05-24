const AUTH_COOKIE_PREFIXES = ['sb-', 'supabase-auth-token'];

export const isAuthCookie = (name: string): boolean =>
  AUTH_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix) || name.includes('auth-token'));

export const getProjectAuthCookiePrefix = (): string | null => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  const ref = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  return ref ? `sb-${ref}-auth-token` : null;
};
