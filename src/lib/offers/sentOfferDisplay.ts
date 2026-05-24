import { getProductPublicPath } from '@/constants/marketplace';
import { formatOfferItemsMeta } from '@/lib/offers/formatOfferItemsLabel';
import type { BuyerOffer } from '@/types/marketplace';

export const getSentOfferHref = (offer: BuyerOffer): string => {
  const itemId = offer.items[0]?.id ?? offer.itemIds[0];
  if (itemId) return getProductPublicPath(offer.publicationSlug, itemId);
  return `/p/${offer.publicationSlug}`;
};

export const getSentOfferMetaLabel = (offer: BuyerOffer): string => {
  const itemMeta = formatOfferItemsMeta(offer.items, offer.itemIds.length);
  return itemMeta ? `${offer.publicationTitle} · ${itemMeta}` : offer.publicationTitle;
};
