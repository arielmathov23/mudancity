'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OfferList } from '@/components/offers/OfferList';
import { SentOfferCard } from '@/components/buyer/SentOfferCard';
import { useQuery } from '@tanstack/react-query';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import { useOwnerOffers } from '@/hooks/useOffers';
import { getMisOfertasPath, parseMisOfertasTab } from '@/lib/offers/misOfertasTab';
import type { BuyerOffer } from '@/types/marketplace';
import { cn } from '@/lib/utils/cn';

type Tab = 'sent' | 'received';

interface MyOffersContentProps {
  defaultTab?: Tab;
  isOwner?: boolean;
}

export const MyOffersContent = ({ defaultTab = 'sent', isOwner = false }: MyOffersContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = parseMisOfertasTab(searchParams.get('tab'));
  const [tab, setTab] = useState<Tab>(tabFromUrl ?? (isOwner ? defaultTab : 'sent'));

  const selectTab = (next: Tab) => {
    setTab(next);
    router.replace(getMisOfertasPath(next), { scroll: false });
  };

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
            onClick={() => selectTab('sent')}
            className={cn(
              'py-2.5 text-xs font-medium transition-colors',
              tab === 'sent' ? 'bg-teal-600 text-white' : 'text-warm-muted hover:bg-cream-100',
            )}
          >
            Enviadas
          </button>
          <button
            type="button"
            onClick={() => selectTab('received')}
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
            <SentOfferCard key={offer.id} offer={offer} />
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
