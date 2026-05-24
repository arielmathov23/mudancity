'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/PriceInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShareProductButton } from '@/components/publications/ShareProductButton';
import { PublicationStatusBadge } from '@/components/publications/ItemCard';
import { TrashIcon } from '@/components/icons/TrashIcon';
import {
  deleteItemAction,
  updateItemAction,
  uploadItemPhotoAction,
} from '@/actions/marketplaceActions';
import { DEFAULT_CURRENCY_CODE, COMPACT_CHIP_CLASS, PRODUCT_DESCRIPTION_MAX_LENGTH, type CurrencyCode } from '@/constants/marketplace';
import { formatMoneyDisplay, numberToPriceRaw, parsePriceRawToNumber } from '@/lib/format/price';
import { cn } from '@/lib/utils/cn';
import type { OwnerProductCardProps } from '@/types/marketplace';

export const OwnerProductCard = ({
  item,
  publicationId,
  publicSlug,
  status,
  offerCount,
}: OwnerProductCardProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(() => numberToPriceRaw(item.price));
  const [currency, setCurrency] = useState<CurrencyCode>(
    (item.currency as CurrencyCode) ?? DEFAULT_CURRENCY_CODE,
  );
  const [description, setDescription] = useState(item.description ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setName(item.name);
      setPrice(numberToPriceRaw(item.price));
      setCurrency((item.currency as CurrencyCode) ?? DEFAULT_CURRENCY_CODE);
      setDescription(item.description ?? '');
    }
  }, [item.id, item.name, item.price, item.currency, item.description, isEditing]);

  const resetEdit = () => {
    setName(item.name);
    setPrice(numberToPriceRaw(item.price));
    setCurrency((item.currency as CurrencyCode) ?? DEFAULT_CURRENCY_CODE);
    setDescription(item.description ?? '');
    setError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setError(null);

    const parsedPrice = parsePriceRawToNumber(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('Ingresá un precio válido mayor a 0');
      return;
    }

    setLoading(true);

    const result = await updateItemAction(item.id, {
      publicationId,
      name: name.trim(),
      price: parsedPrice,
      currency,
      description: description.trim() || undefined,
    });

    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setIsEditing(false);
    router.refresh();
  };

  const handlePhotoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('itemId', item.id);
    formData.append('publicationId', publicationId);
    formData.append('file', file);
    await uploadItemPhotoAction(formData);
    router.refresh();
  };

  const handleDelete = async () => {
    await deleteItemAction(item.id, publicationId);
    router.refresh();
  };

  return (
    <div className="relative border border-line bg-surface p-3">
      {!isEditing && (
        <button
          type="button"
          aria-label="Eliminar producto"
          onClick={handleDelete}
          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center border border-line text-warm-muted transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600"
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </button>
      )}

      <div className="flex items-stretch gap-4">
        <div className="relative h-32 w-32 shrink-0 border border-line-soft bg-cream-100">
          {item.photoUrl ? (
            <Image src={item.photoUrl} alt={item.name} fill className="object-cover" sizes="128px" />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-warm-muted">
              Sin foto
            </div>
          )}
        </div>

        <div className={cn('flex min-h-32 min-w-0 flex-1 flex-col', !isEditing && 'justify-between pr-8')}>
          {isEditing ? (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="space-y-1">
                <Label htmlFor={`name-${item.id}`} className="text-xs">
                  Nombre
                </Label>
                <Input
                  id={`name-${item.id}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`price-${item.id}`} className="text-xs">
                  Precio
                </Label>
                <PriceInput
                  id={`price-${item.id}`}
                  value={price}
                  currency={currency}
                  onCurrencyChange={setCurrency}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`description-${item.id}`} className="text-xs">
                  Descripción (opcional)
                </Label>
                <Textarea
                  id={`description-${item.id}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={PRODUCT_DESCRIPTION_MAX_LENGTH}
                  rows={3}
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={resetEdit}>
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <p className="truncate font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-teal-700">{formatMoneyDisplay(item.price, item.currency)}</p>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-warm-muted">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 py-1">
                <PublicationStatusBadge status={status} compact />
                <span className="text-[10px] text-warm-muted">
                  {offerCount} oferta{offerCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer">
                  <span className={cn(COMPACT_CHIP_CLASS, 'hover:bg-cream-100')}>Subir foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file);
                    }}
                  />
                </label>
                <button
                  type="button"
                  className={cn(COMPACT_CHIP_CLASS, 'hover:bg-cream-100')}
                  onClick={() => {
                    setPrice(numberToPriceRaw(item.price));
                    setIsEditing(true);
                  }}
                >
                  Editar
                </button>
                <ShareProductButton
                  slug={publicSlug}
                  itemId={item.id}
                  title={item.name}
                  compact
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
