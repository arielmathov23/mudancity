import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FixedBottomActionBar } from '@/components/layout/FixedBottomActionBar';
import type { ProductDetailActionsBarProps } from '@/types/marketplace';

export const ProductDetailActionsBar = ({ slug, itemId, isOpen }: ProductDetailActionsBarProps) => (
  <FixedBottomActionBar className="space-y-2">
    {isOpen ? (
      <Button asChild className="w-full">
        <Link href={`/p/${slug}/ofertar?item=${itemId}`}>Ofertar</Link>
      </Button>
    ) : (
      <p className="py-2 text-center text-sm text-warm-muted">Este producto no acepta ofertas</p>
    )}
    <Button asChild variant="outline" className="w-full">
      <Link href={`/p/${slug}`}>Ver más productos</Link>
    </Button>
  </FixedBottomActionBar>
);
