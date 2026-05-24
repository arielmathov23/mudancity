import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PublicationOffersContent } from '@/components/owner/PublicationOffersContent';
import { getPublicationWithAuth } from '@/services/marketplaceService';
import { requireAuthApp } from '@/lib/auth/verifyAuthApp';

interface PageProps {
  params: Promise<{ pubId: string }>;
}

export default async function PublicationOffersPage({ params }: PageProps) {
  const user = await requireAuthApp();
  const { pubId } = await params;
  const result = await getPublicationWithAuth(user.id, pubId);
  if (!result.success) notFound();

  return (
    <AppShell>
      <Link href={`/mi-mudanza/${result.data.moveId}`} className="mb-4 inline-block text-xs text-teal-600">
        ← Volver a productos
      </Link>
      <PublicationOffersContent publicationId={pubId} />
    </AppShell>
  );
}
