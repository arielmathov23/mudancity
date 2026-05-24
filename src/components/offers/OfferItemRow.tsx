import Image from 'next/image';
import Link from 'next/link';
import type { OfferItemRowProps } from '@/types/marketplace';

export const OfferItemRow = ({ item, href }: OfferItemRowProps) => (
  <Link
    href={href}
    className="flex items-center gap-3 border border-line bg-cream-50 p-2 transition-colors hover:border-teal-600"
  >
    <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-line-soft bg-cream-100">
      {item.photoUrl ? (
        <Image src={item.photoUrl} alt={item.name} fill className="object-cover" sizes="48px" />
      ) : (
        <div className="flex h-full items-center justify-center text-[10px] text-warm-muted">Sin foto</div>
      )}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
      <p className="text-xs font-semibold text-teal-700">
        ${item.price.toLocaleString('es-AR')}
      </p>
    </div>
  </Link>
);
