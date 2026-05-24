import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicationStatusBadge } from '@/components/publications/ItemCard';
import { getProductPublicPath } from '@/constants/marketplace';
import type { FeedMoveGroup, ActiveMoveSummary, FeedItem, PublishCtaProps } from '@/types/feed';

interface ProductTileProps {
  item: FeedItem;
  isAuthenticated: boolean;
}

export const ProductTile = ({ item, isAuthenticated }: ProductTileProps) => {
  const productPath = getProductPublicPath(item.publicSlug, item.id);
  const href = isAuthenticated
    ? productPath
    : `/login?next=${encodeURIComponent(productPath)}`;

  return (
    <Link
      href={href}
      className="group flex w-[148px] shrink-0 flex-col border border-line bg-surface transition-colors hover:border-teal-700"
    >
      <div className="relative aspect-square border-b border-line-soft bg-cream-100">
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="148px"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-2 text-center text-xs text-warm-muted">
            Sin foto
          </div>
        )}
        <div className="absolute left-1.5 top-1.5">
          <PublicationStatusBadge status={item.status} />
        </div>
        {!isAuthenticated && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-neutral-900/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-[10px] font-medium text-white">Ingresá para ver</span>
          </div>
        )}
      </div>
      <div className="space-y-1.5 p-2">
        <p className="truncate text-xs font-medium text-foreground">{item.name}</p>
        <p className="text-xs font-semibold text-teal-600">
          ${item.price.toLocaleString('es-AR')}
        </p>
        <span className="block border border-line px-2 py-0.5 text-center text-[10px] text-warm-muted transition-colors group-hover:border-teal-700 group-hover:text-teal-700">
          Ver
        </span>
      </div>
    </Link>
  );
};

interface MoveFeedRowProps {
  group: FeedMoveGroup;
  isAuthenticated: boolean;
}

export const MoveFeedRow = ({ group, isAuthenticated }: MoveFeedRowProps) => (
  <section className="space-y-2 border-t border-line pt-4">
    <div className="flex items-baseline justify-between gap-2 border-b border-line-soft pb-2">
      <h2 className="text-sm font-semibold text-foreground">{group.moveTitle}</h2>
      <span className="text-[10px] font-mono text-warm-muted">
        {group.items.length} artículo{group.items.length !== 1 ? 's' : ''}
      </span>
    </div>
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {group.items.map((item) => (
        <ProductTile key={item.id} item={item} isAuthenticated={isAuthenticated} />
      ))}
    </div>
  </section>
);

export const PublishCta = ({ isAuthenticated, ownerMoves = [] }: PublishCtaProps) => {
  if (!isAuthenticated) {
    return (
      <Link
        href="/login?next=/mi-mudanza"
        className="block border border-teal-600/30 bg-teal-600 px-4 py-4 text-white shadow-sm transition-colors hover:bg-teal-700"
      >
        <p className="text-xs font-mono uppercase tracking-widest text-teal-100">Vender en tu mudanza</p>
        <p className="mt-1 text-base font-bold">Publicá tus muebles</p>
        <p className="mt-1 text-xs text-teal-100">
          Creá tu mudanza, subí fotos y recibí ofertas en minutos.
        </p>
        <span className="mt-3 inline-block border border-white/40 px-3 py-1.5 text-xs font-medium">
          Ingresá y empezá →
        </span>
      </Link>
    );
  }

  if (ownerMoves.length > 0) {
    const primary = ownerMoves[0];
    const productLabel = `${primary.productCount} producto${primary.productCount !== 1 ? 's' : ''}`;
    const offerLabel = `${primary.totalOffers} oferta${primary.totalOffers !== 1 ? 's' : ''}`;

    return (
      <div className="border border-teal-600/30 bg-teal-600 px-4 py-4 text-white shadow-sm">
        <p className="text-xs font-mono uppercase tracking-widest text-teal-100">Tu mudanza</p>
        <p className="mt-1 text-base font-bold">{primary.title}</p>
        <p className="mt-1 text-xs text-teal-100">
          {productLabel} · {offerLabel}
        </p>
        {ownerMoves.length > 1 && (
          <p className="mt-1 text-xs text-teal-100/90">
            +{ownerMoves.length - 1} mudanza{ownerMoves.length - 1 !== 1 ? 's' : ''} más
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={`/mi-mudanza/${primary.moveId}`}
            className="inline-block border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/20"
          >
            Gestionar productos →
          </Link>
          <Link
            href="/mi-mudanza/nueva"
            className="inline-block border border-white/40 px-3 py-1.5 text-xs font-medium text-teal-50 transition-colors hover:bg-white/10"
          >
            Nueva mudanza
          </Link>
        </div>
        {ownerMoves.length > 1 && (
          <Link href="/mi-mudanza" className="mt-2 inline-block text-xs text-teal-100 underline-offset-2 hover:underline">
            Ver todas mis mudanzas
          </Link>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/mi-mudanza/nueva"
      className="block border border-teal-600/30 bg-teal-600 px-4 py-4 text-white shadow-sm transition-colors hover:bg-teal-700"
    >
      <p className="text-xs font-mono uppercase tracking-widest text-teal-100">Vender en tu mudanza</p>
      <p className="mt-1 text-base font-bold">Publicá tus muebles</p>
      <p className="mt-1 text-xs text-teal-100">
        Creá tu mudanza, subí fotos y recibí ofertas en minutos.
      </p>
      <span className="mt-3 inline-block border border-white/40 px-3 py-1.5 text-xs font-medium">
        Crear mudanza →
      </span>
    </Link>
  );
};

interface PublicHomeFeedProps {
  feedGroups: FeedMoveGroup[];
  isAuthenticated: boolean;
}

export const PublicHomeFeed = ({ feedGroups, isAuthenticated }: PublicHomeFeedProps) => {
  if (feedGroups.length === 0) {
    return (
      <div className="border border-dashed border-line bg-surface p-8 text-center">
        <p className="text-sm text-warm-muted">Todavía no hay artículos publicados.</p>
        <p className="mt-1 text-xs text-warm-muted/80">Sé el primero en publicar tu mudanza.</p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      {feedGroups.map((group) => (
        <MoveFeedRow key={group.moveId} group={group} isAuthenticated={isAuthenticated} />
      ))}
    </section>
  );
};

interface ActiveMovesSectionProps {
  moves: ActiveMoveSummary[];
  title?: string;
  showOwnerLink?: boolean;
}

export const ActiveMovesSection = ({
  moves,
  title = 'Mudanzas activas',
  showOwnerLink = false,
}: ActiveMovesSectionProps) => {
  if (moves.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {showOwnerLink && (
          <Link href="/mi-mudanza" className="text-xs text-teal-700">
            Gestionar
          </Link>
        )}
      </div>
      {moves.map((move) => (
        <Card key={move.moveId}>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <Link href={`/mi-mudanza/${move.moveId}`} className="font-medium text-foreground hover:text-teal-700">
                {move.moveTitle}
              </Link>
              <Badge variant="open">{move.totalOffers} ofertas</Badge>
            </div>
            <ul className="space-y-2">
              {move.items.map((item) => (
                <li key={item.itemId}>
                  <Link
                    href={getProductPublicPath(item.publicSlug, item.itemId)}
                    className="flex items-center justify-between gap-2 border border-line bg-cream px-3 py-2 text-sm hover:border-teal-700"
                  >
                    <span className="truncate font-medium">{item.name}</span>
                    <span className="shrink-0 text-xs font-semibold text-teal-600">
                      ${item.price.toLocaleString('es-AR')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
