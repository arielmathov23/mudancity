import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ItemCard, PublicationStatusBadge } from '@/components/publications/ItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProductPublicPath } from '@/constants/marketplace';
import { getPublicationBySlug } from '@/repositories/publicationRepository';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);
  return {
    title: publication ? `${publication.title} — Mudancity` : 'Publicación — Mudancity',
  };
};

export default async function PublicPublicationPage({ params }: PageProps) {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);
  if (!publication) notFound();

  if (publication.items.length === 1) {
    redirect(getProductPublicPath(slug, publication.items[0].id));
  }

  const totalPrice = publication.items.reduce((sum, i) => sum + i.price, 0);

  return (
    <AppShell
      header={{
        title: publication.title,
        backHref: '/',
      }}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            {publication.description && (
              <p className="text-sm text-warm-muted">{publication.description}</p>
            )}
          </div>
          <PublicationStatusBadge status={publication.status} />
        </div>

        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-warm-muted">Precio total listado</p>
            <p className="text-2xl font-bold text-teal-700">${totalPrice.toLocaleString('es-AR')}</p>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-foreground">Productos</h2>
          {publication.items.map((item) => (
            <Link key={item.id} href={getProductPublicPath(slug, item.id)}>
              <ItemCard item={item} />
            </Link>
          ))}
        </div>

        {publication.status === 'open' ? (
          <Button asChild className="w-full">
            <Link href={`/p/${slug}/ofertar`}>Ofertar por el lote</Link>
          </Button>
        ) : (
          <p className="text-center text-sm text-warm-muted">Esta publicación está cerrada</p>
        )}
      </div>
    </AppShell>
  );
}
