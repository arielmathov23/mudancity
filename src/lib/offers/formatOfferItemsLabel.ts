import type { Item } from '@/types/marketplace';

export const formatOfferItemsLabel = (
  items: Pick<Item, 'name'>[],
  itemIdsCount = 0,
): string => {
  const count = items.length || itemIdsCount;
  if (count === 0) return 'Varios productos';
  if (items.length === 1) return items[0].name;
  if (items.length > 1) return `${items[0].name} +${items.length - 1} más`;
  return `${count} producto${count !== 1 ? 's' : ''}`;
};

export const formatOfferItemsMeta = (items: Pick<Item, 'name'>[], itemIdsCount = 0): string | null => {
  const count = items.length || itemIdsCount;
  if (count <= 1) return null;
  return `${count} productos en la oferta`;
};
