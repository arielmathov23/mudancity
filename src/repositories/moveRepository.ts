import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { mapMove } from '@/lib/mappers/marketplace';
import type { Move } from '@/types/marketplace';

export const getMovesByOwnerId = async (ownerId: string): Promise<Move[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('moves')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMove);
};

export const getMoveById = async (id: string): Promise<Move | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('moves').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapMove(data) : null;
};

export const createMove = async (
  ownerId: string,
  input: {
    title: string;
    neighborhood: string;
    city: string;
    country: string;
  },
): Promise<Move> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('moves')
    .insert({
      owner_id: ownerId,
      title: input.title,
      neighborhood: input.neighborhood,
      city: input.city,
      country: input.country,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapMove(data);
};

export const updateMove = async (
  moveId: string,
  input: {
    title?: string;
    neighborhood?: string;
    city?: string;
    country?: string;
  },
): Promise<Move> => {
  const patch: Record<string, string> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.neighborhood !== undefined) patch.neighborhood = input.neighborhood;
  if (input.city !== undefined) patch.city = input.city;
  if (input.country !== undefined) patch.country = input.country;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('moves')
    .update(patch)
    .eq('id', moveId)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapMove(data);
};

export const deleteMove = async (moveId: string): Promise<void> => {
  const supabase = await createClient();
  const { error } = await supabase.from('moves').delete().eq('id', moveId);
  if (error) throw new Error(error.message);
};

export const getFirstPublicationDateForMove = async (moveId: string): Promise<string | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('publications')
    .select('created_at')
    .eq('move_id', moveId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.created_at ?? null;
};
