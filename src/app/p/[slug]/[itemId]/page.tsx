import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ProductVerticalFeed } from '@/components/publications/ProductVerticalFeed';
import { getSessionProfile } from '@/lib/auth/session';
import { getPublicFeedProductsFlat } from '@/repositories/feedRepository';
import { getPublicProductBySlug } from '@/repositories/publicationRepository';
import type { PublicFeedProduct } from '@/types/feed';

interface PageProps {
  params: Promise<{ slug: string; itemId: string }>;
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug, itemId } = await params;
  const product = await getPublicProductBySlug(slug, itemId);
  return {
    title: product ? `${product.item.name} — Mudancity` : 'Producto — Mudancity',
  };
};

const buildFeedWithCurrentProduct = (
  feedProducts: PublicFeedProduct[],
  current: PublicFeedProduct,
): PublicFeedProduct[] => {
  const existingIndex = feedProducts.findIndex(
    (product) => product.publicSlug === current.publicSlug && product.id === current.id,
  );

  if (existingIndex >= 0) return feedProducts;

  return [current, ...feedProducts];
};

export default async function PublicProductPage({ params }: PageProps) {
  const { slug, itemId } = await params;
  const [{ user }, product, feedProducts] = await Promise.all([
    getSessionProfile(),
    getPublicProductBySlug(slug, itemId),
    getPublicFeedProductsFlat(),
  ]);

  if (!product) notFound();

  const currentProduct: PublicFeedProduct = {
    id: product.item.id,
    moveId: product.publication.moveId,
    publicationId: product.publication.id,
    publicSlug: slug,
    name: product.item.name,
    price: product.item.price,
    currency: product.item.currency,
    description: product.item.description,
    photoUrl: product.item.photoUrl,
    status: product.publication.status,
    moveTitle: product.moveTitle,
    neighborhood: product.neighborhood,
    city: product.city,
    country: product.country,
    publicationDescription: product.publication.description,
    ownerId: product.publication.ownerId,
  };

  const products = buildFeedWithCurrentProduct(feedProducts, currentProduct);
  const initialIndex = products.findIndex(
    (item) => item.publicSlug === slug && item.id === itemId,
  );

  return (
    <AppShell showNav contentClassName="overflow-hidden p-0 pt-0 pb-0">
      <ProductVerticalFeed
        products={products}
        initialIndex={Math.max(initialIndex, 0)}
        currentUserId={user?.id ?? null}
      />
    </AppShell>
  );
}
