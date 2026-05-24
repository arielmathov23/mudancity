import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PublishCta, PublicHomeFeed } from '@/components/home/HomeFeed';
import { getExplorePath } from '@/constants/feed';
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
  const ownerMoveIds = ownerMoves.map((move) => move.moveId);

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

      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Artículos publicados</h2>
          {!isAuthenticated && (
            <p className="text-xs text-warm-muted">Tocá un artículo para ingresar y ver más</p>
          )}
        </div>
        {openFeed.length > 0 && (
          <Link href={getExplorePath()} className="shrink-0 text-xs text-teal-700">
            Ver todos
          </Link>
        )}
      </div>

      <PublicHomeFeed
        feedGroups={openFeed}
        isAuthenticated={isAuthenticated}
        ownerMoveIds={ownerMoveIds}
      />
    </AppShell>
  );
}
