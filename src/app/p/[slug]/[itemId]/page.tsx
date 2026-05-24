import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ProductImageCarousel } from '@/components/publications/ProductImageCarousel';
import { PublicationStatusBadge } from '@/components/publications/ItemCard';
import { ShareProductButton } from '@/components/publications/ShareProductButton';
import { ProductDetailActionsBar } from '@/components/publications/ProductDetailActionsBar';
import { getPublicProductBySlug } from '@/repositories/publicationRepository';

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

export default async function PublicProductPage({ params }: PageProps) {
  const { slug, itemId } = await params;
  const product = await getPublicProductBySlug(slug, itemId);
  if (!product) notFound();

  const { item, publication, moveTitle } = product;
  const images = item.photoUrl ? [item.photoUrl] : [];
  const mudanzaTag = `Parte de la mudanza ${moveTitle}`;
  const customDescription =
    publication.description && publication.description !== mudanzaTag
      ? publication.description
      : null;

  return (
    <AppShell
      header={{
        title: item.name,
        description: moveTitle,
        backHref: '/',
        showBrand: false,
        className: 'mb-2 border-b-0 pb-0',
        actions: (
          <>
            <PublicationStatusBadge status={publication.status} compact />
            <ShareProductButton
              slug={slug}
              itemId={itemId}
              title={item.name}
              compact
            />
          </>
        ),
      }}
    >
      <div className="space-y-3 pb-28">
        <ProductImageCarousel images={images} alt={item.name} />

        <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
          <p className="text-2xl font-bold text-teal-700">
            ${item.price.toLocaleString('es-AR')}
          </p>
          <span className="max-w-[52%] border border-line px-2 py-1 text-right text-[10px] leading-snug text-warm-muted">
            {mudanzaTag}
          </span>
        </div>

        {customDescription && (
          <p className="text-sm leading-relaxed text-warm-muted">{customDescription}</p>
        )}
      </div>

      <ProductDetailActionsBar
        slug={slug}
        itemId={itemId}
        isOpen={publication.status === 'open'}
      />
    </AppShell>
  );
}
