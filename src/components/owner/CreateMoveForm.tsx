'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createMoveAction } from '@/actions/marketplaceActions';

export const CreateMoveForm = ({ redirectBase = '/mi-mudanza' }: { redirectBase?: string }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await createMoveAction({ title, neighborhood, city, country });
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push(`${redirectBase}/${result.data.id}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Nombre de la mudanza</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mudanza Palermo → Belgrano" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="neighborhood">Barrio</Label>
        <Input id="neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Ej. Palermo" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">Ciudad</Label>
        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ej. Buenos Aires" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">País</Label>
        <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ej. Argentina" required />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creando...' : 'Crear mudanza'}
      </Button>
    </form>
  );
};
