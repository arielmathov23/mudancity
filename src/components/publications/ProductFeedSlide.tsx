import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LocationIcon } from '@/components/icons/LocationIcon';
import { formatMoneyDisplay } from '@/lib/format/price';
import { formatMoveLocation } from '@/lib/location';
import { PRODUCT_FEED_DETAILS_RESERVE } from '@/constants/productFeed';
import type { ProductFeedSlideProps } from '@/types/feed';

export const ProductFeedSlide = ({ product, isPriority = false, isOwner = false }: ProductFeedSlideProps) => {
  const mudanzaTag = `Mudanza ${product.moveTitle}`;
  const locationLabel = formatMoveLocation(product);
  const defaultDescriptions = new Set([
    mudanzaTag,
    `Parte de la mudanza ${product.moveTitle}`,
  ]);
  const customDescription =
    product.publicationDescription && !defaultDescriptions.has(product.publicationDescription)
      ? product.publicationDescription
      : null;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div
        className="relative min-h-0 flex-1 overflow-hidden border-y border-line bg-cream-100"
        style={{ maxHeight: `calc(100% - ${PRODUCT_FEED_DETAILS_RESERVE})` }}
      >
        {product.photoUrl ? (
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 420px"
            priority={isPriority}
          />
        ) : (
          <div className="flex h-full min-h-[40dvh] items-center justify-center px-6 text-center text-sm text-warm-muted">
            Sin foto
          </div>
        )}
      </div>

      <div className="shrink-0 space-y-3 bg-cream-50 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-bold leading-tight text-foreground">{product.name}</h2>
            <p className="text-2xl font-bold text-teal-700">
              {formatMoneyDisplay(product.price, product.currency)}
            </p>
          </div>
          <span className="max-w-[45%] shrink-0 border border-line px-2 py-1 text-right text-[10px] leading-snug text-warm-muted">
            {mudanzaTag}
          </span>
        </div>

        {product.description && (
          <p className="text-sm leading-relaxed text-warm-muted">{product.description}</p>
        )}

        {customDescription && (
          <p className="text-sm leading-relaxed text-warm-muted">{customDescription}</p>
        )}

        {locationLabel && (
          <p className="flex items-center gap-1.5 text-sm text-warm-muted">
            <LocationIcon className="h-4 w-4 shrink-0 text-teal-600" />
            <span>{locationLabel}</span>
          </p>
        )}

        {product.status === 'open' && !isOwner ? (
          <Button asChild className="w-full">
            <Link href={`/p/${product.publicSlug}/ofertar?item=${product.id}`}>Ofertar</Link>
          </Button>
        ) : product.status === 'open' && isOwner ? (
          <p className="py-2 text-center text-sm text-warm-muted">
            Este es tu producto — no podés ofertar en tu propia publicación
          </p>
        ) : (
          <p className="py-2 text-center text-sm text-warm-muted">Este producto no acepta ofertas</p>
        )}
      </div>
    </div>
  );
};
