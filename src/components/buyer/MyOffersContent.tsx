'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { OfferList } from '@/components/offers/OfferList';
import {
  COORDINATION_STATUS_LABELS,
  OFFER_RESPONSE_LABELS,
} from '@/constants/marketplace';
import { useQuery } from '@tanstack/react-query';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import { useOwnerOffers } from '@/hooks/useOffers';
import type { BuyerOffer } from '@/types/marketplace';
import { cn } from '@/lib/utils/cn';

type Tab = 'sent' | 'received';

interface MyOffersContentProps {
  defaultTab?: Tab;
  isOwner?: boolean;
}

export const MyOffersContent = ({ defaultTab = 'sent', isOwner = false }: MyOffersContentProps) => {
  const [tab, setTab] = useState<Tab>(isOwner ? defaultTab : 'sent');

  const { data: sentOffers, isLoading: loadingSent } = useQuery({
    queryKey: ['my-offers'],
    queryFn: () => authenticatedFetch<BuyerOffer[]>('/my-offers'),
  });

  const { data: receivedOffers, isLoading: loadingReceived } = useOwnerOffers();

  return (
    <div className="space-y-4">
      {isOwner && (
        <div className="grid grid-cols-2 divide-x divide-line border border-line bg-surface">
          <button
            type="button"
            onClick={() => setTab('sent')}
            className={cn(
              'py-2.5 text-xs font-medium transition-colors',
              tab === 'sent' ? 'bg-teal-600 text-white' : 'text-warm-muted hover:bg-cream-100',
            )}
          >
            Enviadas
          </button>
          <button
            type="button"
            onClick={() => setTab('received')}
            className={cn(
              'py-2.5 text-xs font-medium transition-colors',
              tab === 'received' ? 'bg-teal-600 text-white' : 'text-warm-muted hover:bg-cream-100',
            )}
          >
            Recibidas
          </button>
        </div>
      )}

      {tab === 'sent' && (
        <>
          {loadingSent && <p className="text-sm text-warm-muted">Cargando...</p>}
          {!loadingSent && (!sentOffers || sentOffers.length === 0) && (
            <p className="text-sm text-warm-muted">Todavía no enviaste ofertas.</p>
          )}
          {sentOffers?.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="space-y-2 pt-4">
                <div className="flex justify-between gap-2">
                  <p className="font-medium">{offer.publicationTitle}</p>
                  <p className="font-semibold text-teal-600">
                    ${offer.offeredPrice.toLocaleString('es-AR')}
                  </p>
                </div>
                <p className="text-xs text-warm-muted">
                  {format(new Date(offer.createdAt), "d MMM yyyy HH:mm", { locale: es })}
                </p>
                {offer.response && (
                  <Badge variant={offer.response === 'accepted' ? 'open' : 'closed'}>
                    {OFFER_RESPONSE_LABELS[offer.response]}
                  </Badge>
                )}
                {offer.coordinationStatus && (
                  <Badge variant={offer.coordinationStatus === 'coordinated' ? 'coordinated' : 'pending'}>
                    {COORDINATION_STATUS_LABELS[offer.coordinationStatus]}
                  </Badge>
                )}
                <Link href={`/p/${offer.publicationSlug}`} className="text-xs text-teal-600">
                  Ver publicación →
                </Link>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {tab === 'received' && isOwner && (
        <>
          {loadingReceived && <p className="text-sm text-warm-muted">Cargando...</p>}
          {!loadingReceived && (
            <OfferList offers={receivedOffers ?? []} />
          )}
        </>
      )}
    </div>
  );
};
