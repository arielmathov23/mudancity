import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { mapProfile } from '@/lib/mappers/marketplace';
import type { Profile, UserRole } from '@/types/marketplace';

export const getProfileById = async (id: string): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapProfile(data) : null;
};

export const updateProfileContact = async (
  id: string,
  input: { email: string; phone: string; displayName?: string },
): Promise<Profile> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({
      email: input.email,
      phone: input.phone,
      display_name: input.displayName ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapProfile(data);
};

export const updateProfileRole = async (id: string, role: UserRole): Promise<void> => {
  const supabase = await createClient();
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
  if (error) throw new Error(error.message);
};

export const getBuyerContactById = async (
  buyerId: string,
): Promise<{ email: string; phone: string; displayName: string | null } | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('email, phone, display_name')
    .eq('id', buyerId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.email || !data?.phone) return null;
  return {
    email: data.email,
    phone: data.phone,
    displayName: data.display_name,
  };
};
