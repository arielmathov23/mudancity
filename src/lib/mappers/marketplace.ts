export const mapProfile = (row: Record<string, unknown>) => ({
  id: row.id as string,
  role: row.role as 'owner' | 'buyer',
  email: (row.email as string | null) ?? null,
  phone: (row.phone as string | null) ?? null,
  displayName: (row.display_name as string | null) ?? null,
  createdAt: row.created_at as string,
});

export const mapMove = (row: Record<string, unknown>) => ({
  id: row.id as string,
  ownerId: row.owner_id as string,
  title: row.title as string,
  createdAt: row.created_at as string,
});

export const mapPublication = (row: Record<string, unknown>) => ({
  id: row.id as string,
  moveId: row.move_id as string,
  ownerId: row.owner_id as string,
  title: row.title as string,
  description: (row.description as string | null) ?? null,
  status: row.status as 'open' | 'closed',
  type: row.type as 'bundle' | 'subset',
  publicSlug: row.public_slug as string,
  createdAt: row.created_at as string,
  updatedAt: row.updated_at as string,
});

export const mapItem = (row: Record<string, unknown>, photoUrl: string | null = null) => ({
  id: row.id as string,
  publicationId: row.publication_id as string,
  name: row.name as string,
  price: Number(row.price),
  photoPath: (row.photo_path as string | null) ?? null,
  photoUrl,
  sortOrder: Number(row.sort_order ?? 0),
  createdAt: row.created_at as string,
});

export const mapOffer = (row: Record<string, unknown>, itemIds: string[] = []) => ({
  id: row.id as string,
  publicationId: row.publication_id as string,
  moveId: row.move_id as string,
  buyerId: row.buyer_id as string,
  offeredPrice: Number(row.offered_price),
  createdAt: row.created_at as string,
  itemIds,
});

export const getPhotoPublicUrl = (photoPath: string | null): string | null => {
  if (!photoPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/item-photos/${photoPath}`;
};
