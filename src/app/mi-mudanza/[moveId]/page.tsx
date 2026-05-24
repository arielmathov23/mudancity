import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { MoveProductsEditor } from '@/components/owner/MoveProductsEditor';
import { getMoveProductsWithAuth } from '@/services/marketplaceService';
import { requireAuthApp } from '@/lib/auth/verifyAuthApp';

interface PageProps {
  params: Promise<{ moveId: string }>;
}

export default async function MoveDetailPage({ params }: PageProps) {
  const user = await requireAuthApp();
  const { moveId } = await params;

  const result = await getMoveProductsWithAuth(user.id, moveId);
  if (!result.success) notFound();

  const { move, publication } = result.data;

  return (
    <AppShell>
      <div className="space-y-4">
        <Link href="/mi-mudanza" className="text-xs text-teal-600">
          ← Mi mudanza
        </Link>
        <MoveProductsEditor
          key={`${publication.id}-${publication.items.length}-${publication.updatedAt}`}
          moveTitle={move.title}
          publication={publication}
        />
      </div>
    </AppShell>
  );
}
