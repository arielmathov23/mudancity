import { getReceivedOfferStatus } from '@/lib/offers/receivedOfferStatus';
import { formatOfferItemsLabel, formatOfferItemsMeta } from '@/lib/offers/formatOfferItemsLabel';
import { OfferPreviewCard } from '@/components/offers/OfferPreviewCard';
import type { ReceivedOfferCardProps } from '@/types/marketplace';

export const ReceivedOfferCard = ({ offer }: ReceivedOfferCardProps) => (
  <OfferPreviewCard
    title={formatOfferItemsLabel(offer.items, offer.itemIds.length)}
    metaLabel={formatOfferItemsMeta(offer.items, offer.itemIds.length)}
    createdAt={offer.createdAt}
    offeredPrice={offer.offeredPrice}
    status={getReceivedOfferStatus(offer)}
    href="/mis-ofertas"
    actionLabel="Gestionar"
  />
);
