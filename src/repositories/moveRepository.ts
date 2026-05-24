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

export const createMove = async (ownerId: string, title: string): Promise<Move> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('moves')
    .insert({ owner_id: ownerId, title })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapMove(data);
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
