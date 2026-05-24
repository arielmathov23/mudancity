import { getSentOfferStatus } from '@/lib/offers/sentOfferStatus';
import { OfferPreviewCard } from '@/components/offers/OfferPreviewCard';
import type { SentOfferCardProps } from '@/types/marketplace';

export const SentOfferCard = ({ offer }: SentOfferCardProps) => (
  <OfferPreviewCard
    title={offer.publicationTitle}
    createdAt={offer.createdAt}
    offeredPrice={offer.offeredPrice}
    status={getSentOfferStatus(offer)}
    href={`/p/${offer.publicationSlug}`}
    actionLabel="Ver publicación"
  />
);
