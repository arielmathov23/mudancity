import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { getProfileById } from '@/repositories/profileRepository';
import type { Profile } from '@/types/marketplace';

export const getSessionProfile = async (): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };
  const profile = await getProfileById(user.id);
  return { user: { id: user.id, email: user.email }, profile };
};

export const isProfileComplete = (
  profile: Profile | null,
  authEmail?: string | null,
): boolean => !!(profile?.phone && (profile?.email || authEmail));
