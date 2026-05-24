'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditIcon } from '@/components/icons/EditIcon';
import { LocationIcon } from '@/components/icons/LocationIcon';
import { updateMoveAction } from '@/actions/marketplaceActions';
import { formatMoveLocation } from '@/lib/location';
import type { MoveDetailsHeaderProps } from '@/types/marketplace';

export const MoveDetailsHeader = ({ move: initialMove }: MoveDetailsHeaderProps) => {
  const router = useRouter();
  const [move, setMove] = useState(initialMove);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialMove.title);
  const [neighborhood, setNeighborhood] = useState(initialMove.neighborhood ?? '');
  const [city, setCity] = useState(initialMove.city ?? '');
  const [country, setCountry] = useState(initialMove.country ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formattedLocation = formatMoveLocation(move);

  useEffect(() => {
    setMove(initialMove);
    setTitle(initialMove.title);
    setNeighborhood(initialMove.neighborhood ?? '');
    setCity(initialMove.city ?? '');
    setCountry(initialMove.country ?? '');
  }, [initialMove]);

  const resetForm = () => {
    setTitle(move.title);
    setNeighborhood(move.neighborhood ?? '');
    setCity(move.city ?? '');
    setCountry(move.country ?? '');
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    setOpen(nextOpen);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await updateMoveAction(move.id, {
      title: title.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      country: country.trim(),
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setMove(result.data);
    setTitle(result.data.title);
    setNeighborhood(result.data.neighborhood ?? '');
    setCity(result.data.city ?? '');
    setCountry(result.data.country ?? '');
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="min-w-0 space-y-1">
        <h1 className="truncate text-xl font-bold text-foreground">{move.title}</h1>
        <div className="flex min-w-0 items-center gap-1.5">
          <LocationIcon className="h-3.5 w-3.5 shrink-0 text-teal-600" />
          <p className="truncate text-sm text-warm-muted">
            {formattedLocation ?? 'Agregar ubicación'}
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded p-1 text-warm-muted transition-colors hover:text-teal-600"
            aria-label="Editar nombre y ubicación"
          >
            <EditIcon className="h-4 w-4 opacity-70" />
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent aria-describedby="move-details-description">
          <DialogHeader>
            <DialogTitle>Editar mudanza</DialogTitle>
            <DialogDescription id="move-details-description">
              Actualizá el nombre y dónde están los muebles para retirar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moveTitle">Nombre</Label>
              <Input
                id="moveTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Nuñez"
                maxLength={120}
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="moveNeighborhood">Barrio</Label>
                <Input
                  id="moveNeighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ej. Palermo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moveCity">Ciudad</Label>
                <Input
                  id="moveCity"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej. Buenos Aires"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moveCountry">País</Label>
                <Input
                  id="moveCountry"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Ej. Argentina"
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" className="flex-1" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
