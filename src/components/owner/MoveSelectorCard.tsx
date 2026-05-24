import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { MoveSelectorCardProps } from '@/types/feed';

export const MoveSelectorCard = ({ move, isActive }: MoveSelectorCardProps) => {
  const productLabel = `${move.productCount} producto${move.productCount !== 1 ? 's' : ''}`;
  const offerLabel = `${move.totalOffers} oferta${move.totalOffers !== 1 ? 's' : ''}`;

  return (
    <Link
      href={`/mi-mudanza?moveId=${move.moveId}`}
      aria-current={isActive ? 'true' : undefined}
      className={cn(
        'flex w-[156px] shrink-0 flex-col gap-1 border p-3 transition-colors',
        isActive
          ? 'border-teal-700 bg-teal-50'
          : 'border-line bg-surface hover:border-teal-700',
      )}
    >
      <p className="truncate text-sm font-medium text-foreground">{move.title}</p>
      <p className="text-[10px] text-warm-muted">
        {productLabel} · {offerLabel}
      </p>
    </Link>
  );
};
