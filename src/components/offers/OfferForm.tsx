'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { PriceInput } from '@/components/ui/PriceInput';
import { Label } from '@/components/ui/label';
import { ItemCard } from '@/components/publications/ItemCard';
import { useCreateOffer } from '@/hooks/useOffers';
import type { Item } from '@/types/marketplace';

const formSchema = z.object({
  offeredPrice: z.coerce.number().positive('El precio debe ser mayor a 0'),
});

interface OfferFormProps {
  publicationId: string;
  items: Item[];
  isOpen: boolean;
  preselectedItemId?: string;
}

export const OfferForm = ({ publicationId, items, isOpen, preselectedItemId }: OfferFormProps) => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (preselectedItemId && items.some((item) => item.id === preselectedItemId)) {
      return [preselectedItemId];
    }
    return items.map((item) => item.id);
  });
  const [error, setError] = useState<string | null>(null);
  const createOffer = useCreateOffer();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    if (!isOpen) {
      setError('Esta publicación está cerrada');
      return;
    }
    if (selectedIds.length === 0) {
      setError('Seleccioná al menos un ítem');
      return;
    }
    try {
      await createOffer.mutateAsync({
        publicationId,
        offeredPrice: data.offeredPrice,
        itemIds: selectedIds,
      });
      router.push('/mis-ofertas');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al enviar oferta');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="offeredPrice">Precio ofrecido</Label>
        <PriceInput id="offeredPrice" placeholder="Ej. 150.000" {...register('offeredPrice')} />
        {errors.offeredPrice && <p className="text-xs text-red-600">{errors.offeredPrice.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Ítems incluidos en tu oferta</Label>
        <div className="space-y-2">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              selectable
              selected={selectedIds.includes(item.id)}
              onToggle={toggleItem}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting || !isOpen}>
        {isSubmitting ? 'Enviando...' : 'Enviar oferta'}
      </Button>
    </form>
  );
};
