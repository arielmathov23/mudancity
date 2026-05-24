import {
  OFFER_RECEIVED_STATUS_LABELS,
  OFFER_RESPONSE_LABELS,
  OFFER_SENT_STATUS_LABELS,
} from '@/constants/marketplace';
import type { OfferWithDetails, SentOfferStatusDisplay } from '@/types/marketplace';

export const getReceivedOfferStatus = (
  offer: Pick<OfferWithDetails, 'response' | 'coordinationStatus'>,
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

  return { label: OFFER_RECEIVED_STATUS_LABELS.awaiting, variant: 'pending' };
};
