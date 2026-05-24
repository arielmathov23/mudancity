import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionNumber } from '@/components/layout/GridRuler';
import { ActiveMovesSection } from '@/components/home/HomeFeed';
import { MoveListCard } from '@/components/owner/MoveListCard';
import { getOwnerMovesForHome, getActiveMovesWithOffers } from '@/repositories/feedRepository';
import { requireAuthApp } from '@/lib/auth/verifyAuthApp';

export default async function MiMudanzaPage() {
  const user = await requireAuthApp();
  const [moves, activeMoves] = await Promise.all([
    getOwnerMovesForHome(user.id),
    getActiveMovesWithOffers(user.id),
  ]);

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
      <div className="space-y-6">
        {moves.length === 0 ? (
          <Card>
            <CardContent className="space-y-3 pt-4 text-sm text-neutral-500">
              <p>Todavía no creaste una mudanza.</p>
              <Button asChild size="sm">
                <Link href="/mi-mudanza/nueva">Crear mudanza</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {moves.map((move) => (
              <MoveListCard key={move.moveId} move={move} />
            ))}
          </div>
        )}

        {activeMoves.length > 0 && (
          <div className="space-y-2">
            <SectionNumber number="02" />
            <ActiveMovesSection
              moves={activeMoves}
              title="Tus mudanzas activas"
            />
          </div>
        )}

        <Button asChild variant="outline" className="w-full">
          <Link href="/owner/analytics">Ver analytics</Link>
        </Button>
      </div>
    </AppShell>
  );
}
