import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import type { OfferPreviewCardProps } from '@/types/marketplace';

export const OfferPreviewCard = ({
  title,
  metaLabel,
  photoUrl,
  expandTitle = false,
  createdAt,
  offeredPrice,
  status,
  href,
  actionLabel,
}: OfferPreviewCardProps) => (
  <Link
    href={href}
    className={cn(
      'group block border border-line bg-surface transition-colors hover:border-teal-600',
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
          ${offeredPrice.toLocaleString('es-AR')}
        </p>
      </div>

      <div className={cn('mt-2.5 flex gap-3', !photoUrl && 'block')}>
        {photoUrl && (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-line-soft bg-cream-100">
            <Image src={photoUrl} alt="" fill className="object-cover" sizes="56px" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-sm font-medium leading-snug text-foreground',
              !expandTitle && 'line-clamp-2',
            )}
          >
            {title}
          </p>
          {metaLabel && <p className="mt-1 text-xs text-warm-muted">{metaLabel}</p>}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line-soft pt-2.5">
        <time dateTime={createdAt} className="text-[11px] text-warm-muted">
          {format(new Date(createdAt), "d MMM yyyy · HH:mm", { locale: es })}
        </time>
        <span className="text-xs font-medium text-teal-700 transition-colors group-hover:text-teal-800">
          {actionLabel} →
        </span>
      </div>
    </div>
  </Link>
);
