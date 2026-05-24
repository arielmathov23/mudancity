'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ItemCard } from '@/components/publications/ItemCard';
import { CopyIcon } from '@/components/icons/NavIcons';
import { ShareProductButton } from '@/components/publications/ShareProductButton';
import { ImageDropzone } from '@/components/ui/ImageDropzone';
import {
  addItemAction,
  deleteItemAction,
  updatePublicationAction,
  uploadItemPhotoAction,
} from '@/actions/marketplaceActions';
import type { MoveProductsEditorProps } from '@/types/marketplace';

export const MoveProductsEditor = ({ moveTitle, publication: initial }: MoveProductsEditorProps) => {
  const router = useRouter();
  const [publication, setPublication] = useState(initial);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(initial.items.length === 0);

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
      price: parseFloat(price),
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

  const handlePhotoUpload = async (itemId: string, file: File) => {
    const formData = new FormData();
    formData.append('itemId', itemId);
    formData.append('publicationId', publication.id);
    formData.append('file', file);
    await uploadItemPhotoAction(formData);
    router.refresh();
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteItemAction(itemId, publication.id);
    router.refresh();
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">{moveTitle}</h1>
          <p className="text-sm text-warm-muted">Productos</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleToggleStatus}>
          {publication.status === 'open' ? 'Pausar' : 'Publicar'}
        </Button>
      </div>

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
            <Input
              id="productPrice"
              placeholder="0"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
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
            <Button type="button" variant="outline" size="sm" className="flex-1" onClick={resetAddForm}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="flex-1" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          <h2 className="font-medium">
            {publication.items.length === 0
              ? 'Sin productos todavía'
              : `${publication.items.length} producto${publication.items.length !== 1 ? 's' : ''}`}
          </h2>
          {publication.items.length === 0 && (
            <p className="text-sm text-warm-muted">
              Tocá <span className="font-medium text-teal-600">Agregar producto</span> para cargar tus muebles.
            </p>
          )}
          {publication.items.map((item) => (
            <div key={item.id} className="space-y-2">
              <ItemCard item={item} />
              <div className="flex flex-wrap gap-2 px-1">
                <label className="cursor-pointer">
                  <span className="inline-flex h-8 items-center border border-line px-3 text-xs hover:bg-cream-100">
                    Subir foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(item.id, file);
                    }}
                  />
                </label>
                <ShareProductButton
                  slug={publication.publicSlug}
                  itemId={item.id}
                  title={item.name}
                />
                <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
