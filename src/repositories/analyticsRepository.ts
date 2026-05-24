import 'server-only';

import { addDays, differenceInHours, parseISO } from 'date-fns';
import { POC_WINDOW_DAYS, RESPONSE_SLA_HOURS } from '@/constants/marketplace';
import { getFirstPublicationDateForMove, getMovesByOwnerId } from '@/repositories/moveRepository';
import { createClient } from '@/lib/supabase/server';
import type { MoveKpis } from '@/types/marketplace';

export const computeKpisForMove = async (
  moveId: string,
  ownerId: string,
): Promise<MoveKpis | null> => {
  const supabase = await createClient();
  const move = await supabase.from('moves').select('title').eq('id', moveId).eq('owner_id', ownerId).maybeSingle();
  if (!move.data) return null;

  const anchor = await getFirstPublicationDateForMove(moveId);
  if (!anchor) {
    return {
      moveId,
      moveTitle: move.data.title,
      windowStart: new Date().toISOString(),
      windowEnd: addDays(new Date(), POC_WINDOW_DAYS).toISOString(),
      totalPublications: 0,
      publicationsWithOffers: 0,
      offerRate: 0,
      totalOffers: 0,
      responsesUnder24h: 0,
      responseRateUnder24h: 0,
      acceptedOffers: 0,
      coordinatedOffers: 0,
      coordinationRate: 0,
    };
  }

  const windowStart = parseISO(anchor);
  const windowEnd = addDays(windowStart, POC_WINDOW_DAYS);

  const { data: publications } = await supabase
    .from('publications')
    .select('id, created_at')
    .eq('move_id', moveId)
    .gte('created_at', windowStart.toISOString())
    .lte('created_at', windowEnd.toISOString());

  const pubIds = (publications ?? []).map((p) => p.id);
  const totalPublications = pubIds.length;

  if (totalPublications === 0) {
    return {
      moveId,
      moveTitle: move.data.title,
      windowStart: windowStart.toISOString(),
      windowEnd: windowEnd.toISOString(),
      totalPublications: 0,
      publicationsWithOffers: 0,
      offerRate: 0,
      totalOffers: 0,
      responsesUnder24h: 0,
      responseRateUnder24h: 0,
      acceptedOffers: 0,
      coordinatedOffers: 0,
      coordinationRate: 0,
    };
  }

  const { data: offers } = await supabase
    .from('offers')
    .select('id, publication_id, created_at')
    .in('publication_id', pubIds)
    .gte('created_at', windowStart.toISOString())
    .lte('created_at', windowEnd.toISOString());

  const allOffers = offers ?? [];
  const totalOffers = allOffers.length;
  const pubsWithOffers = new Set(allOffers.map((o) => o.publication_id)).size;
  const offerRate = totalPublications > 0 ? pubsWithOffers / totalPublications : 0;

  const offerIds = allOffers.map((o) => o.id);
  let responsesUnder24h = 0;
  let acceptedOffers = 0;
  let coordinatedOffers = 0;

  if (offerIds.length > 0) {
    const [{ data: responses }, { data: coordinations }] = await Promise.all([
      supabase.from('offer_responses').select('offer_id, response, response_at').in('offer_id', offerIds),
      supabase.from('coordinations').select('offer_id, status, coordinated_at').in('offer_id', offerIds),
    ]);

    const offerMap = new Map(allOffers.map((o) => [o.id, o]));

    for (const r of responses ?? []) {
      const offer = offerMap.get(r.offer_id);
      if (!offer) continue;
      const hours = differenceInHours(parseISO(r.response_at), parseISO(offer.created_at));
      if (hours < RESPONSE_SLA_HOURS) responsesUnder24h++;
      if (r.response === 'accepted') acceptedOffers++;
    }

    coordinatedOffers = (coordinations ?? []).filter((c) => c.status === 'coordinated').length;
  }

  return {
    moveId,
    moveTitle: move.data.title,
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
    totalPublications,
    publicationsWithOffers: pubsWithOffers,
    offerRate,
    totalOffers,
    responsesUnder24h,
    responseRateUnder24h: totalOffers > 0 ? responsesUnder24h / totalOffers : 0,
    acceptedOffers,
    coordinatedOffers,
    coordinationRate: acceptedOffers > 0 ? coordinatedOffers / acceptedOffers : 0,
  };
};

export const computeKpisForOwner = async (ownerId: string): Promise<MoveKpis[]> => {
  const moves = await getMovesByOwnerId(ownerId);
  const results = await Promise.all(moves.map((m) => computeKpisForMove(m.id, ownerId)));
  return results.filter(Boolean) as MoveKpis[];
};
