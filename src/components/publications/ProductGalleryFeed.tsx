'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { ProductVerticalFeed } from '@/components/publications/ProductVerticalFeed';
import { FEED_PAGE_SIZE } from '@/constants/feed';
import type { FeedProductsPage, ProductGalleryFeedProps, PublicFeedProduct } from '@/types/feed';

const fetchFeedPage = async (moveId: string | null, offset: number): Promise<FeedProductsPage> => {
  const params = new URLSearchParams({ offset: String(offset), limit: String(FEED_PAGE_SIZE) });
  if (moveId) params.set('moveId', moveId);
  const response = await fetch(`/api/feed/products?${params.toString()}`);
  const json = (await response.json()) as { ok: boolean; data?: FeedProductsPage; error?: string };
  if (!response.ok || !json.ok || !json.data) throw new Error(json.error ?? 'No se pudieron cargar los artículos');
  return json.data;
};

const mergeProducts = (pages: FeedProductsPage[]): PublicFeedProduct[] => {
  const seen = new Set<string>();
  return pages.flatMap((page) =>
    page.products.filter((product) => {
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    }),
  );
};

export const ProductGalleryFeed = ({
  initialPage,
  initialIndex,
  moveId,
  currentUserId = null,
}: ProductGalleryFeedProps) => {
  const query = useInfiniteQuery({
    queryKey: ['feed-products', moveId],
    queryFn: ({ pageParam }) => fetchFeedPage(moveId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.reduce((count, page) => count + page.products.length, 0) : undefined,
    initialData: { pages: [initialPage], pageParams: [0] },
  });

  return (
    <ProductVerticalFeed
      products={mergeProducts(query.data?.pages ?? [initialPage])}
      initialIndex={initialIndex}
      currentUserId={currentUserId}
      urlMode="gallery"
      galleryMoveId={moveId}
      backHref="/"
      hasMore={query.hasNextPage}
      isFetchingMore={query.isFetchingNextPage}
      onLoadMore={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
      }}
    />
  );
};
