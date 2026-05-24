import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { MoveListCardProps } from '@/types/feed';

export const MoveListCard = ({ move }: MoveListCardProps) => {
  const productLabel = `${move.productCount} producto${move.productCount !== 1 ? 's' : ''}`;
  const offerLabel = `${move.totalOffers} oferta${move.totalOffers !== 1 ? 's' : ''}`;

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <div>
          <p className="font-medium text-neutral-900">{move.title}</p>
          <p className="text-xs text-neutral-500">
            {format(new Date(move.createdAt), "d MMM yyyy", { locale: es })} · {productLabel} · {offerLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/mi-mudanza/${move.moveId}`}>Gestionar productos</Link>
          </Button>
          {move.publicationId ? (
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link href={`/owner/publicaciones/${move.publicationId}/ofertas`}>Ver ofertas</Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="flex-1" disabled>
              Ver ofertas
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
