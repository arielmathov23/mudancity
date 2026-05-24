import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import type { OfferPreviewCardProps } from '@/types/marketplace';

export const OfferPreviewCard = ({
  title,
  metaLabel,
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

      <p className="mt-2.5 line-clamp-2 text-sm font-medium leading-snug text-foreground">
        {title}
      </p>

      {metaLabel && <p className="mt-1 text-xs text-warm-muted">{metaLabel}</p>}

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
