import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { PUBLICATION_STATUS_LABELS, COMPACT_CHIP_CLASS } from '@/constants/marketplace';
import { cn } from '@/lib/utils/cn';
import type { ItemCardProps, PublicationStatusBadgeProps } from '@/types/marketplace';

export const ItemCard = ({ item, selectable, selected, onToggle, footer }: ItemCardProps) => (
  <div className="border border-line bg-surface p-3">
    <div className="flex gap-3">
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle?.(item.id)}
          className="mt-1 h-4 w-4 accent-teal-600"
        />
      )}
      <div className="relative h-16 w-16 shrink-0 border border-line-soft bg-cream-100">
        {item.photoUrl ? (
          <Image src={item.photoUrl} alt={item.name} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-warm-muted">Sin foto</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{item.name}</p>
        <p className="text-sm text-teal-700">${item.price.toLocaleString('es-AR')}</p>
        {footer && <div className="mt-2 flex flex-wrap gap-2">{footer}</div>}
      </div>
    </div>
  </div>
);

export const PublicationStatusBadge = ({ status, compact }: PublicationStatusBadgeProps) => (
  <Badge
    variant={status === 'open' ? 'open' : 'closed'}
    className={cn(compact && COMPACT_CHIP_CLASS)}
  >
    {PUBLICATION_STATUS_LABELS[status]}
  </Badge>
);
