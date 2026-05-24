'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/PriceInput';
import { Label } from '@/components/ui/label';
import { OwnerProductCard } from '@/components/owner/OwnerProductCard';
import { MoveDetailsHeader } from '@/components/owner/MoveDetailsHeader';
import { MoveDeleteDialog } from '@/components/owner/MoveDeleteDialog';
import { CopyIcon } from '@/components/icons/NavIcons';
import { ImageDropzone } from '@/components/ui/ImageDropzone';
import {
  addItemAction,
  updatePublicationAction,
  uploadItemPhotoAction,
} from '@/actions/marketplaceActions';
import { Textarea } from '@/components/ui/textarea';
import { DEFAULT_CURRENCY_CODE, PRODUCT_DESCRIPTION_MAX_LENGTH, type CurrencyCode } from '@/constants/marketplace';
import { parsePriceRawToNumber } from '@/lib/format/price';
import type { MoveProductsEditorProps } from '@/types/marketplace';

export const MoveProductsEditor = ({
  move,
  publication: initial,
  offerCountsByItemId,
}: MoveProductsEditorProps) => {
  const router = useRouter();
  const [publication, setPublication] = useState(initial);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY_CODE);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(initial.items.length === 0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/p/${publication.publicSlug}`
    : `/p/${publication.publicSlug}`;

  const setPhotoFiles = (incoming: File[], append = false) => {
    const imageFiles = incoming.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    if (!append) {
      photoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPhotos(imageFiles);
      setPhotoPreviewUrls(imageFiles.map((file) => URL.createObjectURL(file)));
      return;
    }

    setPhotos((prev) => [...prev, ...imageFiles]);
    setPhotoPreviewUrls((prev) => [
      ...prev,
      ...imageFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const clearPhotos = () => {
    photoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPhotos([]);
    setPhotoPreviewUrls([]);
  };

  const resetAddForm = () => {
    setName('');
    setPrice('');
    setCurrency(DEFAULT_CURRENCY_CODE);
    setDescription('');
    clearPhotos();
    setError(null);
    setShowAddForm(false);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await addItemAction({
      publicationId: publication.id,
      name,
      price: parsePriceRawToNumber(price),
      currency,
      description: description.trim() || undefined,
    });

    if (!result.success) {
      setLoading(false);
      setError(result.error);
      return;
    }

    if (photos.length > 0) {
      const formData = new FormData();
      formData.append('itemId', result.data.id);
      formData.append('publicationId', publication.id);
      formData.append('file', photos[0]);
      const uploadResult = await uploadItemPhotoAction(formData);
      if (!uploadResult.success) {
        setLoading(false);
        setError(uploadResult.error);
        return;
      }
    }

    setLoading(false);
    resetAddForm();
    router.refresh();
  };

  const handleToggleStatus = async () => {
    const newStatus = publication.status === 'open' ? 'closed' : 'open';
    const result = await updatePublicationAction(publication.id, { status: newStatus });
    if (result.success) setPublication(result.data);
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-2">
        <MoveDetailsHeader move={move} />
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="outline" onClick={handleToggleStatus}>
            {publication.status === 'open' ? 'Pausar' : 'Publicar'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowDeleteDialog(true)}>
            Eliminar
          </Button>
        </div>
      </div>

      <MoveDeleteDialog
        moveId={move.id}
        moveTitle={move.title}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={showAddForm ? 'outline' : 'default'}
          onClick={() => setShowAddForm((open) => !open)}
        >
          {showAddForm ? 'Cerrar' : 'Agregar producto'}
        </Button>
        <Button variant="outline" size="sm" onClick={copyUrl} className="gap-2">
          <CopyIcon />
          {copied ? 'Copiado!' : 'Copiar link'}
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/owner/publicaciones/${publication.id}/ofertas`}>Ver ofertas</Link>
        </Button>
      </div>

      {showAddForm ? (
        <form onSubmit={handleAddItem} className="space-y-4 border border-line bg-surface p-4">
          <div className="border-b border-line-soft pb-3">
            <h2 className="text-lg font-semibold">Agregar producto</h2>
            <p className="text-sm text-warm-muted">Completá los datos del mueble</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="productName">Nombre</Label>
            <Input
              id="productName"
              placeholder="Ej. Mesa de comedor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productPrice">Precio</Label>
            <PriceInput
              id="productPrice"
              placeholder="Ej. 200.000"
              value={price}
              currency={currency}
              onCurrencyChange={setCurrency}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productDescription">Descripción (opcional)</Label>
            <Textarea
              id="productDescription"
              placeholder="Ej. Muy buen estado, retiro por el barrio"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={PRODUCT_DESCRIPTION_MAX_LENGTH}
              rows={3}
            />
          </div>
          <ImageDropzone
            id="productPhotos"
            hint="Podés arrastrar varias. La primera será la foto principal del producto."
            onFilesSelected={(files) => setPhotoFiles(files, photos.length > 0)}
          />
          {photoPreviewUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {photoPreviewUrls.map((url, index) => (
                <div key={url} className="relative h-16 w-16 border border-line bg-cream-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Vista previa ${index + 1}`} className="h-full w-full object-cover" />
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-neutral-900/70 px-1 py-0.5 text-center text-[9px] text-white">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar'}
            </Button>
            <Button type="button" variant="outline" size="sm" className="flex-1" onClick={resetAddForm}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="border-b border-line-soft pb-2">
            <h2 className="text-sm font-semibold text-foreground">Productos</h2>
            {publication.items.length > 0 && (
              <p className="text-xs text-warm-muted">
                {publication.items.length} producto{publication.items.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {publication.items.length === 0 && (
            <p className="text-sm text-warm-muted">
              Tocá <span className="font-medium text-teal-600">Agregar producto</span> para cargar tus muebles.
            </p>
          )}
          {publication.items.map((item) => (
            <OwnerProductCard
              key={item.id}
              item={item}
              publicationId={publication.id}
              publicSlug={publication.publicSlug}
              status={publication.status}
              offerCount={offerCountsByItemId[item.id] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};
