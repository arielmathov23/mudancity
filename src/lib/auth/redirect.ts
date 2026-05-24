import {
  AUTH_NEXT_COOKIE_MAX_AGE_SECONDS,
  AUTH_NEXT_COOKIE_NAME,
} from '@/constants/auth';

export const sanitizeNextPath = (next: string | null | undefined): string => {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/';
  if (next.length > 200) return '/';
  return next;
};

export const setAuthNextCookie = (next: string): void => {
  document.cookie = `${AUTH_NEXT_COOKIE_NAME}=${encodeURIComponent(next)}; path=/; max-age=${AUTH_NEXT_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};
