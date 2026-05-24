import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { OfferForm } from '@/components/offers/OfferForm';
import { FixedBottomActionBar } from '@/components/layout/FixedBottomActionBar';
import { PublicationStatusBadge } from '@/components/publications/ItemCard';
import { ShareProductButton } from '@/components/publications/ShareProductButton';
import { FIXED_BOTTOM_ACTION_CONTENT_CLASS } from '@/constants/layout';
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

  const offerPath = preselectedItemId
    ? `/p/${slug}/ofertar?item=${preselectedItemId}`
    : `/p/${slug}/ofertar`;

  const backHref = preselectedItemId
    ? getProductPublicPath(slug, preselectedItemId)
    : `/p/${slug}`;

  if (!session.user) {
    redirect(`/login?next=${encodeURIComponent(offerPath)}`);
  }

  if (!isProfileComplete(session.profile, session.user.email)) {
    redirect(`/onboarding?next=${encodeURIComponent(offerPath)}`);
  }

  if (session.user.id === publication.ownerId) {
    const shareItemId = preselectedItemId ?? publication.items[0]?.id;
    const shareItem = publication.items.find((item) => item.id === shareItemId);

    return (
      <AppShell showNav={false} contentClassName={FIXED_BOTTOM_ACTION_CONTENT_CLASS}>
        <div className="space-y-4">
          <Link href={backHref} className="text-xs text-teal-600">← Volver</Link>
          <h1 className="text-xl font-bold">{shareItem?.name ?? publication.title}</h1>
          <p className="text-sm text-warm-muted">Tu publicación</p>
        </div>
        {shareItemId && shareItem && (
          <FixedBottomActionBar>
            <ShareProductButton
              slug={slug}
              itemId={shareItemId}
              title={shareItem.name}
              fullWidth
            />
          </FixedBottomActionBar>
        )}
      </AppShell>
    );
  }

  const resolvedItemId =
    preselectedItemId ?? (publication.items.length === 1 ? publication.items[0]?.id : undefined);

  return (
    <AppShell showNav={false} contentClassName={FIXED_BOTTOM_ACTION_CONTENT_CLASS}>
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
          preselectedItemId={resolvedItemId}
        />
      </div>
    </AppShell>
  );
}
