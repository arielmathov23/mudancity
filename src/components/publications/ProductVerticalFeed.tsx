'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { ShareProductButton } from '@/components/publications/ShareProductButton';
import { ProductFeedSlide } from '@/components/publications/ProductFeedSlide';
import { PublicationStatusBadge } from '@/components/publications/ItemCard';
import {
  PRODUCT_FEED_SCROLL_CLASS,
  PRODUCT_FEED_SCROLL_HEIGHT,
  PRODUCT_FEED_SLIDE_CLASS,
} from '@/constants/productFeed';
import { COMPACT_CHIP_CLASS, getProductPublicPath } from '@/constants/marketplace';
import { getExplorePath } from '@/constants/feed';
import { useProductFeedSnap } from '@/hooks/useProductFeedSnap';
import { cn } from '@/lib/utils/cn';
import type { ProductVerticalFeedProps } from '@/types/feed';

export const ProductVerticalFeed = ({
  products,
  initialIndex,
  currentUserId = null,
  urlMode = 'product',
  galleryMoveId = null,
  backHref = '/',
  hasMore = false,
  isFetchingMore = false,
  onLoadMore,
}: ProductVerticalFeedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeProduct = products[activeIndex] ?? products[0];

  const syncUrlForIndex = useCallback(
    (index: number) => {
      const product = products[index];
      if (!product) return;

      const path =
        urlMode === 'gallery'
          ? getExplorePath(galleryMoveId ?? undefined, product.id)
          : getProductPublicPath(product.publicSlug, product.id);

      const currentPath = `${window.location.pathname}${window.location.search}`;
      if (currentPath === path) return;

      window.history.replaceState(null, '', path);
    },
    [products, urlMode, galleryMoveId],
  );

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const { slideHeight } = useProductFeedSnap({
    containerRef,
    slideCount: products.length,
    initialIndex,
    onActiveIndexChange: handleActiveIndexChange,
  });

  useEffect(() => {
    syncUrlForIndex(activeIndex);
  }, [activeIndex, syncUrlForIndex]);

  useEffect(() => {
    if (!hasMore || isFetchingMore || !onLoadMore) return;
    if (activeIndex >= products.length - 2) onLoadMore();
  }, [activeIndex, products.length, hasMore, isFetchingMore, onLoadMore]);

  if (!activeProduct || products.length === 0) return null;

  const isOwner = !!currentUserId && activeProduct.ownerId === currentUserId;
  const slideStyle = slideHeight > 0 ? { height: slideHeight } : undefined;

  return (
    <div
      className="fixed inset-x-0 top-0 z-20 mx-auto flex max-w-md flex-col border-x border-line bg-cream-50"
      style={{ height: PRODUCT_FEED_SCROLL_HEIGHT }}
    >
      <AppHeader
        title={activeProduct.name}
        description={activeProduct.moveTitle}
        backHref={backHref}
        backLabel="Inicio"
        showBrand={false}
        className="mb-2 shrink-0 border-b-0 px-4 pb-0 pt-4"
        actions={
          <>
            {isOwner && (
              <Button asChild variant="outline" className={COMPACT_CHIP_CLASS}>
                <Link href={`/mi-mudanza?moveId=${activeProduct.moveId}`}>Editar</Link>
              </Button>
            )}
            <PublicationStatusBadge status={activeProduct.status} compact />
            <ShareProductButton
              slug={activeProduct.publicSlug}
              itemId={activeProduct.id}
              title={activeProduct.name}
              compact
            />
          </>
        }
      />

      <div
        ref={containerRef}
        className={cn(
          PRODUCT_FEED_SCROLL_CLASS,
          'relative min-h-0 flex-1 overflow-y-auto scrollbar-none',
        )}
        aria-label="Explorar productos"
      >
        {products.map((product, index) => (
          <section
            key={product.id}
            data-index={index}
            aria-label={`${product.name} — ${index + 1} de ${products.length}`}
            className={cn(PRODUCT_FEED_SLIDE_CLASS, 'overflow-hidden')}
            style={slideStyle}
          >
            <ProductFeedSlide product={product} isPriority={index === initialIndex} />
          </section>
        ))}
        {isFetchingMore && (
          <section
            className={cn(PRODUCT_FEED_SLIDE_CLASS, 'flex items-center justify-center bg-cream-50')}
            style={slideStyle}
          >
            <p className="text-xs text-warm-muted">Cargando más artículos...</p>
          </section>
        )}
      </div>
    </div>
  );
};
