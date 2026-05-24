import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { ProductDetailActionsBarProps } from '@/types/marketplace';

export const ProductDetailActionsBar = ({ slug, itemId, isOpen }: ProductDetailActionsBarProps) => (
  <div className="fixed inset-x-0 bottom-[calc(3.25rem+env(safe-area-inset-bottom))] z-40 flex justify-center">
    <div className="w-full max-w-md space-y-2 border-x border-t border-line bg-cream-50 px-4 py-3">
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
    </div>
  </div>
);
