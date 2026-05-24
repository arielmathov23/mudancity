import Link from 'next/link';
import { ReceivedOfferCard } from '@/components/buyer/ReceivedOfferCard';
import { SentOfferCard } from '@/components/buyer/SentOfferCard';
import { HOME_OFFERS_PREVIEW_LIMIT } from '@/constants/feed';
import type { HomeOffersSectionProps } from '@/types/feed';

const sortByNewest = <T extends { createdAt: string }>(offers: T[]) =>
  [...offers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

export const HomeOffersSection = ({ sentOffers, receivedOffers }: HomeOffersSectionProps) => {
  const sentPreview = sortByNewest(sentOffers).slice(0, HOME_OFFERS_PREVIEW_LIMIT);
  const receivedPreview = sortByNewest(receivedOffers).slice(0, HOME_OFFERS_PREVIEW_LIMIT);

  if (sentPreview.length === 0 && receivedPreview.length === 0) return null;

  const pendingReceivedCount = receivedPreview.filter((offer) => !offer.response).length;

  return (
    <section className="mb-6 space-y-3">
      <div className="flex items-end justify-between gap-2 border-b border-line-soft pb-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Ofertas</h2>
          {pendingReceivedCount > 0 && (
            <p className="mt-0.5 text-xs text-amber-800">
              {pendingReceivedCount} sin responder
            </p>
          )}
        </div>
        <Link href="/mis-ofertas" className="shrink-0 text-xs font-medium text-teal-700">
          Ver todas
        </Link>
      </div>

      {sentPreview.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-warm-muted">Enviadas</p>
          <div className="space-y-2">
            {sentPreview.map((offer) => (
              <SentOfferCard key={offer.id} offer={offer} context="home" />
            ))}
          </div>
        </div>
      )}

      {receivedPreview.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-warm-muted">Recibidas</p>
          <div className="space-y-2">
            {receivedPreview.map((offer) => (
              <ReceivedOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
