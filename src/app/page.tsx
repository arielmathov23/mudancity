import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PublishCta, PublicHomeFeed } from '@/components/home/HomeFeed';
import { Button } from '@/components/ui/button';
import { getPublicFeedGroupedByMove, getOwnerMovesForHome } from '@/repositories/feedRepository';
import { getSessionProfile } from '@/lib/auth/session';

export default async function HomePage() {
  const { user } = await getSessionProfile();
  const isAuthenticated = !!user;

  const [feedGroups, ownerMoves] = await Promise.all([
    getPublicFeedGroupedByMove(),
    user ? getOwnerMovesForHome(user.id) : Promise.resolve([]),
  ]);
  const openFeed = feedGroups.filter((group) => group.items.length > 0);

  return (
    <AppShell
      header={{
        title: 'Muebles en mudanza',
        description: 'Explorá lo publicado. Ingresá para ver detalle y ofertar.',
      }}
    >
      <div className="mb-6">
        <PublishCta isAuthenticated={isAuthenticated} ownerMoves={ownerMoves} />
      </div>

      {!isAuthenticated && (
        <div className="mb-5 flex items-center justify-between border border-line bg-surface px-3 py-2.5">
          <p className="text-xs text-warm-muted">¿Querés ofertar o vender?</p>
          <Button asChild size="sm" variant="outline">
            <Link href="/login">Ingresar</Link>
          </Button>
        </div>
      )}

      <div className="mb-3 border-b border-line-soft pb-2">
        <h2 className="text-sm font-semibold text-foreground">Artículos publicados</h2>
        {!isAuthenticated && (
          <p className="text-xs text-warm-muted">Tocá un artículo para ingresar y ver más</p>
        )}
      </div>

      <PublicHomeFeed feedGroups={openFeed} isAuthenticated={isAuthenticated} />
    </AppShell>
  );
}
