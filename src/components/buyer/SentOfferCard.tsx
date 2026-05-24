import { getSentOfferStatus } from '@/lib/offers/sentOfferStatus';
import { formatOfferItemsLabel } from '@/lib/offers/formatOfferItemsLabel';
import { getSentOfferMetaLabel } from '@/lib/offers/sentOfferDisplay';
import { getMisOfertasPath } from '@/lib/offers/misOfertasTab';
import { OfferPreviewCard } from '@/components/offers/OfferPreviewCard';
import { SentOfferListCard } from '@/components/buyer/SentOfferListCard';
import type { SentOfferCardProps } from '@/types/marketplace';

export const SentOfferCard = ({ offer, context = 'list' }: SentOfferCardProps) => {
  if (context === 'list') {
    return <SentOfferListCard offer={offer} />;
  }

  return (
    <OfferPreviewCard
      title={formatOfferItemsLabel(offer.items, offer.itemIds.length)}
      metaLabel={getSentOfferMetaLabel(offer)}
      photoUrl={offer.items[0]?.photoUrl ?? null}
      createdAt={offer.createdAt}
      offeredPrice={offer.offeredPrice}
      status={getSentOfferStatus(offer)}
      href={getMisOfertasPath('sent')}
      actionLabel="Ver oferta"
    />
  );
};
