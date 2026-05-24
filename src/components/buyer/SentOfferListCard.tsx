import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { OfferItemRow } from '@/components/offers/OfferItemRow';
import { getProductPublicPath } from '@/constants/marketplace';
import { getSentOfferStatus } from '@/lib/offers/sentOfferStatus';
import { cn } from '@/lib/utils/cn';
import type { SentOfferCardProps } from '@/types/marketplace';

export const SentOfferListCard = ({ offer }: SentOfferCardProps) => {
  const status = getSentOfferStatus(offer);

  return (
    <article
      className={cn(
        'border border-line bg-surface',
        status.variant === 'pending' && 'border-l-[3px] border-l-amber-500',
        status.variant === 'closed' && 'opacity-90',
      )}
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <Badge variant={status.variant} className="shrink-0">
            {status.label}
          </Badge>
          <p className="text-right text-lg font-bold tabular-nums leading-none text-teal-700">
            ${offer.offeredPrice.toLocaleString('es-AR')}
          </p>
        </div>

        <p className="mt-2 text-xs font-medium text-warm-muted">{offer.publicationTitle}</p>

        <ul className="mt-3 space-y-2">
          {offer.items.length > 0 ? (
            offer.items.map((item) => (
              <li key={item.id}>
                <OfferItemRow
                  item={item}
                  href={getProductPublicPath(offer.publicationSlug, item.id)}
                />
              </li>
            ))
          ) : (
            <li className="border border-dashed border-line-soft px-3 py-2 text-xs text-warm-muted">
              {offer.itemIds.length} producto{offer.itemIds.length !== 1 ? 's' : ''} en la oferta
            </li>
          )}
        </ul>

        <time
          dateTime={offer.createdAt}
          className="mt-3 block border-t border-line-soft pt-2.5 text-[11px] text-warm-muted"
        >
          {format(new Date(offer.createdAt), "d MMM yyyy · HH:mm", { locale: es })}
        </time>
      </div>
    </article>
  );
};
