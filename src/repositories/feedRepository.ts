import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { getPhotoPublicUrl } from '@/lib/mappers/marketplace';
import type { ActiveMoveSummary, FeedMoveGroup, FeedItem, OwnerMoveHomeSummary } from '@/types/feed';

export const getPublicFeedGroupedByMove = async (): Promise<FeedMoveGroup[]> => {
  const supabase = await createClient();

  const { data: publications, error } = await supabase
    .from('publications')
    .select('id, move_id, public_slug, status, moves(id, title)')
    .eq('status', 'open');

  if (error) throw new Error(error.message);
  if (!publications?.length) return [];

  const pubIds = publications.map((p) => p.id);
  const pubById = Object.fromEntries(publications.map((p) => [p.id, p]));

  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('id, publication_id, name, price, photo_path, sort_order')
    .in('publication_id', pubIds)
    .order('sort_order', { ascending: true });

  if (itemsError) throw new Error(itemsError.message);
  if (!items?.length) return [];

  const groupMap = new Map<string, FeedMoveGroup>();

  for (const item of items) {
    const pub = pubById[item.publication_id];
    if (!pub || pub.status !== 'open') continue;

    const move = pub.moves as { id: string; title: string };
    const feedItem: FeedItem = {
      id: item.id,
      moveId: move.id,
      publicationId: pub.id,
      publicSlug: pub.public_slug,
      name: item.name,
      price: Number(item.price),
      photoUrl: getPhotoPublicUrl(item.photo_path),
      status: pub.status as 'open' | 'closed',
    };

    const existing = groupMap.get(move.id);
    if (existing) {
      existing.items.push(feedItem);
    } else {
      groupMap.set(move.id, {
        moveId: move.id,
        moveTitle: move.title,
        items: [feedItem],
      });
    }
  }

  return Array.from(groupMap.values());
};

export const getActiveMovesWithOffers = async (
  ownerId?: string,
): Promise<ActiveMoveSummary[]> => {
  const supabase = await createClient();

  let movesQuery = supabase.from('moves').select('id, title').order('created_at', { ascending: false });
  if (ownerId) movesQuery = movesQuery.eq('owner_id', ownerId);

  const { data: moves, error } = await movesQuery;
  if (error) throw new Error(error.message);
  if (!moves?.length) return [];

  const moveIds = moves.map((m) => m.id);

  const { data: publications } = await supabase
    .from('publications')
    .select('id, move_id, public_slug, status')
    .in('move_id', moveIds)
    .eq('status', 'open');

  if (!publications?.length) return [];

  const pubIds = publications.map((p) => p.id);
  const pubById = Object.fromEntries(publications.map((p) => [p.id, p]));

  const [{ data: items }, { data: offers }] = await Promise.all([
    supabase
      .from('items')
      .select('id, publication_id, name, price, photo_path, sort_order')
      .in('publication_id', pubIds)
      .order('sort_order', { ascending: true }),
    supabase.from('offers').select('id, publication_id').in('publication_id', pubIds),
  ]);

  if (!items?.length) return [];

  const offerIds = (offers ?? []).map((o) => o.id);

  let respondedOfferIds = new Set<string>();
  if (offerIds.length > 0) {
    const { data: responses } = await supabase
      .from('offer_responses')
      .select('offer_id')
      .in('offer_id', offerIds);
    respondedOfferIds = new Set((responses ?? []).map((r) => r.offer_id));
  }

  const offersByPub = (offers ?? []).reduce<Record<string, { total: number; pending: number }>>(
    (acc, o) => {
      if (!acc[o.publication_id]) acc[o.publication_id] = { total: 0, pending: 0 };
      acc[o.publication_id].total += 1;
      if (!respondedOfferIds.has(o.id)) acc[o.publication_id].pending += 1;
      return acc;
    },
    {},
  );

  const itemsByMove = items.reduce<Record<string, ActiveMoveSummary['items']>>((acc, item) => {
    const pub = pubById[item.publication_id];
    if (!pub) return acc;

    const entry = {
      itemId: item.id,
      name: item.name,
      price: Number(item.price),
      photoUrl: getPhotoPublicUrl(item.photo_path),
      publicSlug: pub.public_slug,
    };

    acc[pub.move_id] = [...(acc[pub.move_id] ?? []), entry];
    return acc;
  }, {});

  return moves
    .filter((m) => (itemsByMove[m.id]?.length ?? 0) > 0)
    .map((move) => {
      const moveItems = itemsByMove[move.id] ?? [];
      const movePubIds = publications.filter((p) => p.move_id === move.id).map((p) => p.id);
      const totalOffers = movePubIds.reduce((sum, pubId) => sum + (offersByPub[pubId]?.total ?? 0), 0);

      return {
        moveId: move.id,
        moveTitle: move.title,
        totalOffers,
        items: moveItems,
      };
    });
};

export const getOwnerMovesForHome = async (ownerId: string): Promise<OwnerMoveHomeSummary[]> => {
  const supabase = await createClient();

  const { data: moves, error } = await supabase
    .from('moves')
    .select('id, title, created_at')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  if (!moves?.length) return [];

  const moveIds = moves.map((m) => m.id);

  const { data: publications } = await supabase
    .from('publications')
    .select('id, move_id')
    .in('move_id', moveIds);

  if (!publications?.length) {
    return moves.map((move) => ({
      moveId: move.id,
      title: move.title,
      createdAt: move.created_at,
      publicationId: null,
      productCount: 0,
      totalOffers: 0,
    }));
  }

  const publicationByMove = publications.reduce<Record<string, string>>((acc, pub) => {
    if (!acc[pub.move_id]) acc[pub.move_id] = pub.id;
    return acc;
  }, {});

  const pubIds = publications.map((p) => p.id);

  const [{ data: items }, { data: offers }] = await Promise.all([
    supabase.from('items').select('id, publication_id').in('publication_id', pubIds),
    supabase.from('offers').select('id, publication_id').in('publication_id', pubIds),
  ]);

  const itemCountByMove = (items ?? []).reduce<Record<string, number>>((acc, item) => {
    const pub = publications.find((p) => p.id === item.publication_id);
    if (!pub) return acc;
    acc[pub.move_id] = (acc[pub.move_id] ?? 0) + 1;
    return acc;
  }, {});

  const offerCountByMove = (offers ?? []).reduce<Record<string, number>>((acc, offer) => {
    const pub = publications.find((p) => p.id === offer.publication_id);
    if (!pub) return acc;
    acc[pub.move_id] = (acc[pub.move_id] ?? 0) + 1;
    return acc;
  }, {});

  return moves.map((move) => ({
    moveId: move.id,
    title: move.title,
    createdAt: move.created_at,
    publicationId: publicationByMove[move.id] ?? null,
    productCount: itemCountByMove[move.id] ?? 0,
    totalOffers: offerCountByMove[move.id] ?? 0,
  }));
};
