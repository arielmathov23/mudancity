'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  COORDINATION_STATUS_LABELS,
  OFFER_RESPONSE_LABELS,
} from '@/constants/marketplace';
import { useRespondOffer, useMarkCoordinated } from '@/hooks/useOffers';
import type { OfferWithDetails } from '@/types/marketplace';

interface OfferListProps {
  offers: OfferWithDetails[];
  showActions?: boolean;
}

export const OfferList = ({ offers, showActions = true }: OfferListProps) => {
  const respond = useRespondOffer();
  const markCoordinated = useMarkCoordinated();

  if (offers.length === 0) {
    return <p className="text-sm text-neutral-500">No hay ofertas todavía.</p>;
  }

  return (
    <div className="space-y-3">
      {offers.map((offer) => (
        <Card key={offer.id}>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-teal-600">
                  ${offer.offeredPrice.toLocaleString('es-AR')}
                </p>
                <p className="text-xs text-neutral-500">
                  {format(new Date(offer.createdAt), "d MMM yyyy HH:mm", { locale: es })}
                </p>
              </div>
              {offer.response && (
                <Badge variant={offer.response === 'accepted' ? 'open' : 'closed'}>
                  {OFFER_RESPONSE_LABELS[offer.response]}
                </Badge>
              )}
            </div>

            <p className="text-sm text-neutral-600">
              {offer.items.map((i) => i.name).join(', ') || `${offer.itemIds.length} ítems`}
            </p>

            {offer.response === 'accepted' && offer.buyerContact && (
              <div className="border border-teal-100 bg-teal-50 p-3 text-sm">
                <p className="font-medium text-teal-800">Contacto del comprador</p>
                <p>{offer.buyerContact.email}</p>
                <p>{offer.buyerContact.phone}</p>
              </div>
            )}

            {offer.coordinationStatus && (
              <Badge variant={offer.coordinationStatus === 'coordinated' ? 'coordinated' : 'pending'}>
                {COORDINATION_STATUS_LABELS[offer.coordinationStatus]}
              </Badge>
            )}

            {showActions && !offer.response && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => respond.mutate({ offerId: offer.id, response: 'accepted' })}
                  disabled={respond.isPending}
                >
                  Sí
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => respond.mutate({ offerId: offer.id, response: 'rejected' })}
                  disabled={respond.isPending}
                >
                  No
                </Button>
              </div>
            )}

            {showActions && offer.response === 'accepted' && offer.coordinationStatus === 'pending' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => markCoordinated.mutate(offer.id)}
                disabled={markCoordinated.isPending}
              >
                Marcar coordinado
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
