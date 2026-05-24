import { redirect } from 'next/navigation';
import { getPublicationWithAuth } from '@/services/marketplaceService';
import { requireAuthApp } from '@/lib/auth/verifyAuthApp';

interface PageProps {
  params: Promise<{ pubId: string }>;
}

export default async function PublicationEditPage({ params }: PageProps) {
  const user = await requireAuthApp();
  const { pubId } = await params;
  const result = await getPublicationWithAuth(user.id, pubId);
  if (!result.success) redirect('/mi-mudanza');

  redirect(`/mi-mudanza/${result.data.moveId}`);
}
