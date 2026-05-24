'use client';

import { OfferList } from '@/components/offers/OfferList';
import { usePublicationOffers } from '@/hooks/useOffers';

interface PublicationOffersContentProps {
  publicationId: string;
}

export const PublicationOffersContent = ({ publicationId }: PublicationOffersContentProps) => {
  const { data: offers, isLoading } = usePublicationOffers(publicationId);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Ofertas recibidas</h1>
      {isLoading ? (
        <p className="text-sm text-neutral-500">Cargando...</p>
      ) : (
        <OfferList offers={offers ?? []} />
      )}
    </div>
  );
};
