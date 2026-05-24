import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { OfferForm } from '@/components/offers/OfferForm';
import { PublicationStatusBadge } from '@/components/publications/ItemCard';
import { getProductPublicPath } from '@/constants/marketplace';
import { getPublicationBySlug } from '@/repositories/publicationRepository';
import { getSessionProfile, isProfileComplete } from '@/lib/auth/session';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ item?: string }>;
}

export default async function OfferPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { item: preselectedItemId } = await searchParams;
  const [publication, session] = await Promise.all([
    getPublicationBySlug(slug),
    getSessionProfile(),
  ]);

  if (!publication) notFound();

  const backHref = preselectedItemId
    ? getProductPublicPath(slug, preselectedItemId)
    : `/p/${slug}`;

  if (!session.user) {
    redirect(`/login?next=/p/${slug}/ofertar`);
  }

  if (!isProfileComplete(session.profile)) {
    redirect(`/onboarding?next=/p/${slug}/ofertar`);
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <Link href={backHref} className="text-xs text-teal-600">← Volver</Link>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Hacer oferta</h1>
          <PublicationStatusBadge status={publication.status} />
        </div>
        <p className="text-sm text-neutral-500">{publication.title}</p>
        <OfferForm
          publicationId={publication.id}
          items={publication.items}
          isOpen={publication.status === 'open'}
          preselectedItemId={preselectedItemId}
        />
      </div>
    </AppShell>
  );
}
