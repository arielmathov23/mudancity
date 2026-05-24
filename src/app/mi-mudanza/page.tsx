import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoveProductsEditor } from '@/components/owner/MoveProductsEditor';
import { MoveSelectorCard } from '@/components/owner/MoveSelectorCard';
import { getOwnerMovesForHome } from '@/repositories/feedRepository';
import { getMoveProductsWithAuth } from '@/services/marketplaceService';
import { requireAuthApp } from '@/lib/auth/verifyAuthApp';

interface PageProps {
  searchParams: Promise<{ moveId?: string }>;
}

export default async function MiMudanzaPage({ searchParams }: PageProps) {
  const user = await requireAuthApp();
  const { moveId: selectedMoveId } = await searchParams;
  const moves = await getOwnerMovesForHome(user.id);

  if (moves.length === 0) {
    return (
      <AppShell
        header={{
          title: 'Mi mudanza',
          description: 'Gestioná tus productos',
          actions: (
            <Button asChild size="sm">
              <Link href="/mi-mudanza/nueva">Nueva</Link>
            </Button>
          ),
        }}
      >
        <Card>
          <CardContent className="space-y-3 pt-4 text-sm text-warm-muted">
            <p>Todavía no creaste una mudanza.</p>
            <Button asChild size="sm">
              <Link href="/mi-mudanza/nueva">Crear mudanza</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const activeMoveId = moves.some((move) => move.moveId === selectedMoveId)
    ? selectedMoveId!
    : moves[0].moveId;

  const result = await getMoveProductsWithAuth(user.id, activeMoveId);
  if (!result.success) notFound();

  const { move, publication, offerCountsByItemId } = result.data;
  const hasMultipleMoves = moves.length > 1;

  return (
    <AppShell
      header={{
        title: 'Mi mudanza',
        description: hasMultipleMoves ? 'Elegí una mudanza y gestioná sus productos' : 'Gestioná tus productos',
        actions: (
          <Button asChild size="sm">
            <Link href="/mi-mudanza/nueva">Nueva</Link>
          </Button>
        ),
      }}
    >
      <div className="space-y-6">
        {hasMultipleMoves && (
          <section className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold text-foreground">Tus mudanzas</h2>
              <span className="text-[10px] font-mono text-warm-muted">
                {moves.length} mudanza{moves.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {moves.map((moveSummary) => (
                <MoveSelectorCard
                  key={moveSummary.moveId}
                  move={moveSummary}
                  isActive={moveSummary.moveId === activeMoveId}
                />
              ))}
            </div>
          </section>
        )}

        <MoveProductsEditor
          key={`${publication.id}-${publication.items.length}-${publication.updatedAt}`}
          move={move}
          publication={publication}
          offerCountsByItemId={offerCountsByItemId}
        />

        <Button asChild variant="outline" className="w-full">
          <Link href="/owner/analytics">Ver analytics</Link>
        </Button>
      </div>
    </AppShell>
  );
}
