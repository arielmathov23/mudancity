import { getReceivedOfferStatus } from '@/lib/offers/receivedOfferStatus';
import { formatOfferItemsLabel, formatOfferItemsMeta } from '@/lib/offers/formatOfferItemsLabel';
import { getMisOfertasPath } from '@/lib/offers/misOfertasTab';
import { OfferPreviewCard } from '@/components/offers/OfferPreviewCard';
import type { ReceivedOfferCardProps } from '@/types/marketplace';

export const ReceivedOfferCard = ({ offer }: ReceivedOfferCardProps) => (
  <OfferPreviewCard
    title={formatOfferItemsLabel(offer.items, offer.itemIds.length)}
    metaLabel={formatOfferItemsMeta(offer.items, offer.itemIds.length)}
    photoUrl={offer.items[0]?.photoUrl ?? null}
    createdAt={offer.createdAt}
    offeredPrice={offer.offeredPrice}
    status={getReceivedOfferStatus(offer)}
    href={getMisOfertasPath('received')}
    actionLabel="Gestionar"
  />
);
