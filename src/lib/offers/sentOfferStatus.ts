import {
  COORDINATION_STATUS_LABELS,
  OFFER_RESPONSE_LABELS,
  OFFER_SENT_STATUS_LABELS,
} from '@/constants/marketplace';
import type { BuyerOffer } from '@/types/marketplace';
import type { SentOfferStatusDisplay } from '@/types/marketplace';

export const getSentOfferStatus = (
  offer: Pick<BuyerOffer, 'response' | 'coordinationStatus'>,
): SentOfferStatusDisplay => {
  if (offer.coordinationStatus === 'coordinated') {
    return { label: OFFER_SENT_STATUS_LABELS.coordinated, variant: 'coordinated' };
  }

  if (offer.response === 'accepted') {
    return { label: OFFER_RESPONSE_LABELS.accepted, variant: 'open' };
  }

  if (offer.response === 'rejected') {
    return { label: OFFER_RESPONSE_LABELS.rejected, variant: 'closed' };
  }

  if (offer.coordinationStatus === 'pending') {
    return { label: COORDINATION_STATUS_LABELS.pending, variant: 'pending' };
  }

  return { label: OFFER_SENT_STATUS_LABELS.pending, variant: 'pending' };
};
