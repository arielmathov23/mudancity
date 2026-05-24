'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ItemCard } from '@/components/publications/ItemCard';
import { CopyIcon } from '@/components/icons/NavIcons';
import {
  addItemAction,
  deleteItemAction,
  updatePublicationAction,
  uploadItemPhotoAction,
} from '@/actions/marketplaceActions';
import type { PublicationWithItems } from '@/types/marketplace';

interface PublicationEditorProps {
  publication: PublicationWithItems;
}

export const PublicationEditor = ({ publication: initial }: PublicationEditorProps) => {
  const router = useRouter();
  const [publication, setPublication] = useState(initial);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/p/${publication.publicSlug}`
    : `/p/${publication.publicSlug}`;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await addItemAction({
      publicationId: publication.id,
      name,
      price: parseFloat(price),
    });
    if (!result.success) {
      setError(result.error);
      return;
    }
    setName('');
    setPrice('');
    router.refresh();
  };

  const handleToggleStatus = async () => {
    const newStatus = publication.status === 'open' ? 'closed' : 'open';
    const result = await updatePublicationAction(publication.id, { status: newStatus });
    if (result.success) setPublication(result.data);
  };

  const handleToggleIncluded = async (itemId: string) => {
    const current = publication.includedItemIds;
    const next = current.includes(itemId)
      ? current.filter((id) => id !== itemId)
      : [...current, itemId];
    const result = await updatePublicationAction(publication.id, {
      includedItemIds: next,
      type: 'subset',
    });
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
          <h1 className="text-xl font-bold">{publication.title}</h1>
          <p className="text-xs text-neutral-500 font-mono">/{publication.publicSlug}</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleToggleStatus}>
          {publication.status === 'open' ? 'Cerrar' : 'Abrir'}
        </Button>
      </div>

      <Button variant="outline" size="sm" onClick={copyUrl} className="gap-2">
        <CopyIcon />
        {copied ? 'Copiado!' : 'Copiar URL pública'}
      </Button>

      <form onSubmit={handleAddItem} className="space-y-3 border border-neutral-200 bg-white p-4">
        <h2 className="font-medium">Agregar ítem</h2>
        <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Precio" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" size="sm">Agregar</Button>
      </form>

      <div className="space-y-2">
        <h2 className="font-medium">Ítems ({publication.items.length})</h2>
        {publication.items.map((item) => (
          <div key={item.id} className="space-y-2">
            <ItemCard item={item} />
            <div className="flex gap-2 px-1">
              {publication.type === 'subset' && (
                <Button
                  size="sm"
                  variant={publication.includedItemIds.includes(item.id) ? 'default' : 'outline'}
                  onClick={() => handleToggleIncluded(item.id)}
                >
                  {publication.includedItemIds.includes(item.id) ? 'Incluido' : 'Excluido'}
                </Button>
              )}
              <label className="cursor-pointer">
                <span className="inline-flex h-8 items-center border border-neutral-200 px-3 text-xs hover:bg-neutral-50">
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
              <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
