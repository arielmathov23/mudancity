import 'server-only';

import { createClient } from '@/lib/supabase/server';
import {
  getPhotoPublicUrl,
  mapItem,
  mapPublication,
} from '@/lib/mappers/marketplace';
import type {
  Publication,
  PublicationType,
  PublicationStatus,
  PublicationWithItems,
  PublicProductDetail,
  Item,
} from '@/types/marketplace';

const loadIncludedItemIds = async (publicationId: string, type: PublicationType): Promise<string[]> => {
  const supabase = await createClient();
  if (type === 'bundle') {
    const { data } = await supabase.from('items').select('id').eq('publication_id', publicationId);
    return (data ?? []).map((i) => i.id);
  }
  const { data } = await supabase
    .from('publication_items')
    .select('item_id')
    .eq('publication_id', publicationId);
  return (data ?? []).map((i) => i.item_id);
};

const loadItems = async (publicationId: string): Promise<Item[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('publication_id', publicationId)
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapItem(row, getPhotoPublicUrl(row.photo_path)));
};

export const getPublicationBySlug = async (slug: string): Promise<PublicationWithItems | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('public_slug', slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const publication = mapPublication(data);
  const [items, includedItemIds] = await Promise.all([
    loadItems(publication.id),
    loadIncludedItemIds(publication.id, publication.type),
  ]);

  const includedItems =
    publication.type === 'bundle'
      ? items
      : items.filter((i) => includedItemIds.includes(i.id));

  return { ...publication, items: includedItems, includedItemIds };
};

export const getPublicationById = async (id: string): Promise<PublicationWithItems | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('publications').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const publication = mapPublication(data);
  const [allItems, includedItemIds] = await Promise.all([
    loadItems(publication.id),
    loadIncludedItemIds(publication.id, publication.type),
  ]);

  return { ...publication, items: allItems, includedItemIds };
};

export const getPublicationsByMoveId = async (moveId: string): Promise<Publication[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('move_id', moveId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapPublication);
};

export const createPublication = async (input: {
  moveId: string;
  ownerId: string;
  title: string;
  description?: string;
  type: PublicationType;
  status?: PublicationStatus;
}): Promise<Publication> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('publications')
    .insert({
      move_id: input.moveId,
      owner_id: input.ownerId,
      title: input.title,
      description: input.description ?? null,
      type: input.type,
      status: input.status ?? 'open',
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapPublication(data);
};

export const updatePublication = async (
  id: string,
  input: Partial<{
    title: string;
    description: string;
    status: PublicationStatus;
    type: PublicationType;
  }>,
): Promise<Publication> => {
  const supabase = await createClient();
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) payload.description = input.description;
  if (input.status !== undefined) payload.status = input.status;
  if (input.type !== undefined) payload.type = input.type;

  const { data, error } = await supabase
    .from('publications')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapPublication(data);
};

export const setPublicationIncludedItems = async (
  publicationId: string,
  itemIds: string[],
): Promise<void> => {
  const supabase = await createClient();
  await supabase.from('publication_items').delete().eq('publication_id', publicationId);
  if (itemIds.length === 0) return;
  const { error } = await supabase.from('publication_items').insert(
    itemIds.map((itemId) => ({ publication_id: publicationId, item_id: itemId })),
  );
  if (error) throw new Error(error.message);
};

export const createItem = async (input: {
  publicationId: string;
  name: string;
  price: number;
  currency?: string;
  description?: string | null;
  photoPath?: string;
  sortOrder?: number;
}): Promise<Item> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('items')
    .insert({
      publication_id: input.publicationId,
      name: input.name,
      price: input.price,
      currency: input.currency ?? 'ARS',
      description: input.description?.trim() || null,
      photo_path: input.photoPath ?? null,
      sort_order: input.sortOrder ?? 0,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapItem(data, getPhotoPublicUrl(data.photo_path));
};

export const deleteItem = async (itemId: string): Promise<void> => {
  const supabase = await createClient();
  const { error } = await supabase.from('items').delete().eq('id', itemId);
  if (error) throw new Error(error.message);
};

export const updateItemPhoto = async (itemId: string, photoPath: string): Promise<void> => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('items')
    .update({ photo_path: photoPath })
    .eq('id', itemId);
  if (error) throw new Error(error.message);
};

export const updateItem = async (
  itemId: string,
  input: { name: string; price: number; currency?: string; description?: string | null },
): Promise<Item> => {
  const supabase = await createClient();
  const payload: Record<string, unknown> = {
    name: input.name,
    price: input.price,
  };
  if (input.currency !== undefined) payload.currency = input.currency;
  if (input.description !== undefined) payload.description = input.description?.trim() || null;

  const { data, error } = await supabase
    .from('items')
    .update(payload)
    .eq('id', itemId)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapItem(data, getPhotoPublicUrl(data.photo_path));
};

export const getPublicProductBySlug = async (
  slug: string,
  itemId: string,
): Promise<PublicProductDetail | null> => {
  const publication = await getPublicationBySlug(slug);
  if (!publication) return null;

  const item = publication.items.find((i) => i.id === itemId);
  if (!item) return null;

  const supabase = await createClient();
  const { data: move } = await supabase
    .from('moves')
    .select('title, neighborhood, city, country')
    .eq('id', publication.moveId)
    .maybeSingle();

  return {
    item,
    publication,
    moveTitle: move?.title ?? publication.title,
    neighborhood: (move?.neighborhood as string | null) ?? null,
    city: (move?.city as string | null) ?? null,
    country: (move?.country as string | null) ?? null,
  };
};

export const getPublicationsByOwnerId = async (ownerId: string): Promise<Publication[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapPublication);
};
