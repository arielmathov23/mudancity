import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { createClientFromRequest } from '@/lib/supabase/routeHandler';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getPhotoPublicUrl, mapItem, mapOffer } from '@/lib/mappers/marketplace';
import type { Offer, OfferWithDetails, BuyerOffer, Item } from '@/types/marketplace';

export const createOffer = async (
  input: {
    publicationId: string;
    moveId: string;
    buyerId: string;
    offeredPrice: number;
    itemIds: string[];
  },
  supabaseClient?: SupabaseClient,
): Promise<Offer> => {
  const supabase = supabaseClient ?? await createClient();
  const { data, error } = await supabase
    .from('offers')
    .insert({
      publication_id: input.publicationId,
      move_id: input.moveId,
      buyer_id: input.buyerId,
      offered_price: input.offeredPrice,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);

  if (input.itemIds.length > 0) {
    const { error: itemsError } = await supabase.from('offer_items').insert(
      input.itemIds.map((itemId) => ({ offer_id: data.id, item_id: itemId })),
    );
    if (itemsError) throw new Error(itemsError.message);
  }

  return mapOffer(data, input.itemIds);
};

export const getOffersByPublicationId = async (publicationId: string): Promise<OfferWithDetails[]> => {
  const supabase = await createClient();
  const { data: offers, error } = await supabase
    .from('offers')
    .select('*')
    .eq('publication_id', publicationId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  if (!offers?.length) return [];

  const offerIds = offers.map((o) => o.id);

  const [{ data: offerItems }, { data: responses }, { data: coordinations }, { data: items }] =
    await Promise.all([
      supabase.from('offer_items').select('*').in('offer_id', offerIds),
      supabase.from('offer_responses').select('*').in('offer_id', offerIds),
      supabase.from('coordinations').select('*').in('offer_id', offerIds),
      supabase.from('items').select('*').eq('publication_id', publicationId),
    ]);

  const itemMap = new Map((items ?? []).map((i) => [i.id, mapItem(i, getPhotoPublicUrl(i.photo_path))]));
  const responseMap = new Map((responses ?? []).map((r) => [r.offer_id, r]));
  const coordMap = new Map((coordinations ?? []).map((c) => [c.offer_id, c]));

  const itemsByOffer = (offerItems ?? []).reduce<Record<string, string[]>>((acc, oi) => {
    acc[oi.offer_id] = [...(acc[oi.offer_id] ?? []), oi.item_id];
    return acc;
  }, {});

  return offers.map((row) => {
    const itemIds = itemsByOffer[row.id] ?? [];
    const response = responseMap.get(row.id);
    const coord = coordMap.get(row.id);
    return {
      ...mapOffer(row, itemIds),
      items: itemIds.map((id) => itemMap.get(id)).filter(Boolean) as Item[],
      response: response?.response ?? null,
      responseAt: response?.response_at ?? null,
      coordinationStatus: coord?.status ?? null,
      buyerContact: null,
    };
  });
};

export const getOffersByBuyerId = async (buyerId: string): Promise<BuyerOffer[]> => {
  const supabase = await createClient();
  const { data: offers, error } = await supabase
    .from('offers')
    .select('*, publications(title, public_slug)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  if (!offers?.length) return [];

  const offerIds = offers.map((o) => o.id);
  const [{ data: responses }, { data: coordinations }, { data: offerItems }] = await Promise.all([
    supabase.from('offer_responses').select('*').in('offer_id', offerIds),
    supabase.from('coordinations').select('*').in('offer_id', offerIds),
    supabase.from('offer_items').select('*').in('offer_id', offerIds),
  ]);

  const responseMap = new Map((responses ?? []).map((r) => [r.offer_id, r]));
  const coordMap = new Map((coordinations ?? []).map((c) => [c.offer_id, c]));

  const itemsByOffer = (offerItems ?? []).reduce<Record<string, string[]>>((acc, row) => {
    acc[row.offer_id] = [...(acc[row.offer_id] ?? []), row.item_id];
    return acc;
  }, {});

  const allItemIds = [...new Set((offerItems ?? []).map((row) => row.item_id))];
  const { data: itemRows } = allItemIds.length
    ? await supabase.from('items').select('*').in('id', allItemIds)
    : { data: [] as Record<string, unknown>[] };

  const itemMap = new Map(
    (itemRows ?? []).map((row) => [
      row.id as string,
      mapItem(row, getPhotoPublicUrl(row.photo_path as string | null)),
    ]),
  );

  return offers.map((row) => {
    const pub = row.publications as { title: string; public_slug: string };
    const response = responseMap.get(row.id);
    const coord = coordMap.get(row.id);
    const itemIds = itemsByOffer[row.id] ?? [];
    const items = itemIds.map((id) => itemMap.get(id)).filter(Boolean) as Item[];

    return {
      ...mapOffer(row, itemIds),
      publicationTitle: pub.title,
      publicationSlug: pub.public_slug,
      items,
      response: response?.response ?? null,
      coordinationStatus: coord?.status ?? null,
      coordinatedAt: coord?.coordinated_at ?? null,
    };
  });
};

export const getOfferById = async (offerId: string): Promise<Offer | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('offers').select('*').eq('id', offerId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const { data: offerItems } = await supabase
    .from('offer_items')
    .select('item_id')
    .eq('offer_id', offerId);

  return mapOffer(data, (offerItems ?? []).map((i) => i.item_id));
};

export const upsertOfferResponse = async (
  offerId: string,
  response: 'accepted' | 'rejected',
): Promise<{ response: string; responseAt: string; created: boolean }> => {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('offer_responses')
    .select('*')
    .eq('offer_id', offerId)
    .maybeSingle();

  if (existing) {
    return { response: existing.response, responseAt: existing.response_at, created: false };
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('offer_responses')
    .insert({ offer_id: offerId, response, response_at: now })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return { response: data.response, responseAt: data.response_at, created: true };
};

export const createCoordination = async (offerId: string): Promise<void> => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('coordinations')
    .insert({ offer_id: offerId, status: 'pending' });
  if (error && !error.message.includes('duplicate')) throw new Error(error.message);
};

export const updateCoordinationStatus = async (
  offerId: string,
  status: 'coordinated' | 'closed' | 'cancelled',
): Promise<void> => {
  const supabase = await createClient();
  const payload: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (status === 'coordinated') payload.coordinated_at = new Date().toISOString();

  const { error } = await supabase.from('coordinations').update(payload).eq('offer_id', offerId);
  if (error) throw new Error(error.message);
};

export const getAllOffersForOwner = async (ownerId: string): Promise<OfferWithDetails[]> => {
  const supabase = await createClient();
  const { data: pubs } = await supabase.from('publications').select('id').eq('owner_id', ownerId);
  if (!pubs?.length) return [];

  const results = await Promise.all(pubs.map((p) => getOffersByPublicationId(p.id)));
  return results.flat().sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

export const getOfferCountsByPublicationId = async (
  publicationId: string,
): Promise<Record<string, number>> => {
  const supabase = await createClient();
  const { data: offers, error } = await supabase
    .from('offers')
    .select('id')
    .eq('publication_id', publicationId);
  if (error) throw new Error(error.message);
  if (!offers?.length) return {};

  const offerIds = offers.map((offer) => offer.id);
  const { data: offerItems, error: itemsError } = await supabase
    .from('offer_items')
    .select('item_id')
    .in('offer_id', offerIds);
  if (itemsError) throw new Error(itemsError.message);

  return (offerItems ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.item_id] = (acc[row.item_id] ?? 0) + 1;
    return acc;
  }, {});
};
