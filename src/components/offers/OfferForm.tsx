'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { PriceInput } from '@/components/ui/PriceInput';
import { Label } from '@/components/ui/label';
import { FixedBottomActionBar } from '@/components/layout/FixedBottomActionBar';
import { ItemCard } from '@/components/publications/ItemCard';
import { useCreateOffer } from '@/hooks/useOffers';
import { numberToPriceRaw, parsePriceRawToNumber } from '@/lib/format/price';
import type { CurrencyCode } from '@/constants/marketplace';
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
  const preselectedItem = useMemo(
    () => (preselectedItemId ? items.find((item) => item.id === preselectedItemId) : undefined),
    [items, preselectedItemId],
  );

  const defaultSelectedIds = preselectedItem
    ? [preselectedItem.id]
    : items.map((item) => item.id);

  const defaultOfferedPrice = preselectedItem
    ? preselectedItem.price
    : items.reduce((sum, item) => sum + item.price, 0);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => defaultSelectedIds);
  const [error, setError] = useState<string | null>(null);
  const createOffer = useCreateOffer();

  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { offeredPrice: defaultOfferedPrice },
  });

  const offeredPrice = watch('offeredPrice');

  const selectedCurrency = useMemo(
    () =>
      (items.find((item) => selectedIds.includes(item.id))?.currency ??
        items[0]?.currency) as CurrencyCode | undefined,
    [items, selectedIds],
  );

  const toggleItem = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    const isSelected = selectedIds.includes(id);
    const currentPrice = Number(offeredPrice) || 0;

    if (isSelected) {
      setSelectedIds((prev) => prev.filter((entry) => entry !== id));
      setValue('offeredPrice', Math.max(0, currentPrice - item.price));
      return;
    }

    setSelectedIds((prev) => [...prev, id]);
    setValue('offeredPrice', currentPrice + item.price);
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
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="offeredPrice">Precio ofrecido</Label>
          <Controller
            name="offeredPrice"
            control={control}
            render={({ field }) => (
              <PriceInput
                id="offeredPrice"
                placeholder="Ej. 150.000"
                value={numberToPriceRaw(Number(field.value) || 0)}
                onChange={(event) => field.onChange(parsePriceRawToNumber(event.target.value))}
                currency={selectedCurrency}
              />
            )}
          />
          {errors.offeredPrice && <p className="text-xs text-red-600">{errors.offeredPrice.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Ítems incluidos en tu oferta</Label>
          <div className="space-y-2">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                selectable={items.length > 1}
                selected={selectedIds.includes(item.id)}
                onToggle={toggleItem}
              />
            ))}
          </div>
        </div>
      </div>

      <FixedBottomActionBar className="space-y-2">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="h-11 w-full" disabled={isSubmitting || !isOpen}>
          {isSubmitting ? 'Enviando...' : 'Ofertar'}
        </Button>
      </FixedBottomActionBar>
    </form>
  );
};
