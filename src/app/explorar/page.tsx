import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ProductGalleryFeed } from '@/components/publications/ProductGalleryFeed';
import { FEED_PAGE_SIZE } from '@/constants/feed';
import { getSessionProfile } from '@/lib/auth/session';
import { getPublicFeedProductsPage } from '@/services/feedService';

interface PageProps {
  searchParams: Promise<{ moveId?: string; item?: string }>;
}

export const generateMetadata = async ({ searchParams }: PageProps) => {
  const { moveId } = await searchParams;
  return {
    title: moveId ? 'Artículos de la mudanza — Mudancity' : 'Explorar artículos — Mudancity',
  };
};

export default async function ExplorePage({ searchParams }: PageProps) {
  const { moveId, item: itemId } = await searchParams;
  const [{ user }, initialPage] = await Promise.all([
    getSessionProfile(),
    getPublicFeedProductsPage({ moveId, offset: 0, limit: FEED_PAGE_SIZE }),
  ]);

  if (initialPage.total === 0) {
    return (
      <AppShell
        header={{
          title: 'Explorar artículos',
          backHref: '/',
          backLabel: 'Inicio',
          showBrand: false,
        }}
      >
        <div className="border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-sm text-warm-muted">No hay artículos publicados para mostrar.</p>
          <Link href="/" className="mt-3 inline-block text-xs text-teal-700">
            Volver al inicio
          </Link>
        </div>
      </AppShell>
    );
  }

  const initialIndex = itemId ? initialPage.products.findIndex((product) => product.id === itemId) : 0;

  return (
    <AppShell showNav contentClassName="overflow-hidden p-0 pt-0 pb-0">
      <ProductGalleryFeed
        initialPage={initialPage}
        initialIndex={Math.max(initialIndex, 0)}
        moveId={moveId ?? null}
        currentUserId={user?.id ?? null}
      />
    </AppShell>
  );
}
