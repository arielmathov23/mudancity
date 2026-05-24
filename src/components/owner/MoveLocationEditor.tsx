'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationIcon } from '@/components/icons/LocationIcon';
import { updateMoveAction } from '@/actions/marketplaceActions';
import { formatMoveLocation, hasCompleteMoveLocation } from '@/lib/location';
import type { MoveLocationEditorProps } from '@/types/marketplace';

export const MoveLocationEditor = ({ move: initialMove }: MoveLocationEditorProps) => {
  const router = useRouter();
  const [move, setMove] = useState(initialMove);
  const [editing, setEditing] = useState(!hasCompleteMoveLocation(initialMove));
  const [neighborhood, setNeighborhood] = useState(initialMove.neighborhood ?? '');
  const [city, setCity] = useState(initialMove.city ?? '');
  const [country, setCountry] = useState(initialMove.country ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formattedLocation = formatMoveLocation(move);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await updateMoveAction(move.id, { neighborhood, city, country });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setMove(result.data);
    setEditing(false);
    router.refresh();
  };

  const handleCancel = () => {
    setNeighborhood(move.neighborhood ?? '');
    setCity(move.city ?? '');
    setCountry(move.country ?? '');
    setError(null);
    setEditing(false);
  };

  if (editing) {
    return (
      <form onSubmit={handleSave} className="space-y-4 border border-line bg-surface p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LocationIcon className="h-4 w-4 text-teal-600" />
            <h2 className="font-semibold">Ubicación de los muebles</h2>
          </div>
          <p className="text-sm text-warm-muted">
            Indicá barrio, ciudad y país donde están los productos para retirar.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="moveNeighborhood">Barrio</Label>
            <Input
              id="moveNeighborhood"
              placeholder="Ej. Palermo"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="moveCity">Ciudad</Label>
            <Input
              id="moveCity"
              placeholder="Ej. Buenos Aires"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="moveCountry">País</Label>
            <Input
              id="moveCountry"
              placeholder="Ej. Argentina"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          {formattedLocation && (
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar ubicación'}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3 border border-line bg-surface p-4">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2 text-sm font-medium text-teal-700">
          <LocationIcon className="h-4 w-4 shrink-0" />
          <span>Ubicación</span>
        </div>
        <p className="text-sm text-foreground">{formattedLocation}</p>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
        Editar
      </Button>
    </div>
  );
};
