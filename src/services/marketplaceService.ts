import 'server-only';

import { createServiceLogger } from '@/lib/logger';
import type {
  CreateMoveInput,
  CreatePublicationInput,
  UpdatePublicationInput,
  CreateItemInput,
  OnboardingInput,
} from '@/lib/validation/schemas';
import { updateProfileContact, updateProfileRole, getProfileById } from '@/repositories/profileRepository';
import { createMove, getMoveById, getMovesByOwnerId } from '@/repositories/moveRepository';
import {
  createPublication,
  updatePublication,
  setPublicationIncludedItems,
  createItem,
  deleteItem,
  getPublicationById,
  getPublicationsByMoveId,
  updateItemPhoto,
} from '@/repositories/publicationRepository';
import { createClient } from '@/lib/supabase/server';
import type { ServiceResult, Move, Publication, PublicationWithItems, Item, Profile, MoveWithProducts } from '@/types/marketplace';

const logger = createServiceLogger('marketplaceService');

export const completeOnboardingWithAuth = async (
  userId: string,
  input: OnboardingInput,
): Promise<ServiceResult<Profile>> => {
  const profile = await updateProfileContact(userId, {
    email: input.email,
    phone: input.phone,
    displayName: input.displayName,
  });
  logger.info({ userId }, 'Onboarding completed');
  return { success: true, data: profile };
};

export const becomeOwnerWithAuth = async (userId: string): Promise<ServiceResult<Profile>> => {
  await updateProfileRole(userId, 'owner');
  const profile = await getProfileById(userId);
  if (!profile) return { success: false, error: 'Perfil no encontrado', status: 404 };
  return { success: true, data: profile };
};

export const createMoveWithAuth = async (
  userId: string,
  input: CreateMoveInput,
): Promise<ServiceResult<Move>> => {
  await updateProfileRole(userId, 'owner');
  const move = await createMove(userId, input.title);
  await createPublication({
    moveId: move.id,
    ownerId: userId,
    title: input.title,
    type: 'bundle',
    status: 'open',
  });
  logger.info({ moveId: move.id }, 'Move created');
  return { success: true, data: move };
};

export const getMovesWithAuth = async (userId: string): Promise<ServiceResult<Move[]>> => {
  const moves = await getMovesByOwnerId(userId);
  return { success: true, data: moves };
};

export const getMoveWithAuth = async (
  userId: string,
  moveId: string,
): Promise<ServiceResult<Move>> => {
  const move = await getMoveById(moveId);
  if (!move || move.ownerId !== userId) {
    return { success: false, error: 'Mudanza no encontrada', status: 404 };
  }
  return { success: true, data: move };
};

export const getMoveProductsWithAuth = async (
  userId: string,
  moveId: string,
): Promise<ServiceResult<MoveWithProducts>> => {
  const moveResult = await getMoveWithAuth(userId, moveId);
  if (!moveResult.success) return moveResult;

  let publications = await getPublicationsByMoveId(moveId);
  if (publications.length === 0) {
    const created = await createPublication({
      moveId,
      ownerId: userId,
      title: moveResult.data.title,
      type: 'bundle',
      status: 'open',
    });
    publications = [created];
  }

  const publication = await getPublicationById(publications[0].id);
  if (!publication) {
    return { success: false, error: 'Error al cargar productos', status: 500 };
  }

  return { success: true, data: { move: moveResult.data, publication } };
};

export const createPublicationWithAuth = async (
  userId: string,
  input: CreatePublicationInput,
): Promise<ServiceResult<Publication>> => {
  const move = await getMoveById(input.moveId);
  if (!move || move.ownerId !== userId) {
    return { success: false, error: 'Mudanza no encontrada', status: 404 };
  }

  const publication = await createPublication({
    moveId: input.moveId,
    ownerId: userId,
    title: input.title,
    description: input.description,
    type: input.type,
    status: input.status,
  });

  return { success: true, data: publication };
};

export const updatePublicationWithAuth = async (
  userId: string,
  publicationId: string,
  input: UpdatePublicationInput,
): Promise<ServiceResult<PublicationWithItems>> => {
  const existing = await getPublicationById(publicationId);
  if (!existing || existing.ownerId !== userId) {
    return { success: false, error: 'Publicación no encontrada', status: 404 };
  }

  await updatePublication(publicationId, input);

  if (input.includedItemIds !== undefined && (input.type === 'subset' || existing.type === 'subset')) {
    await setPublicationIncludedItems(publicationId, input.includedItemIds);
  }

  if (input.type === 'bundle') {
    const updated = await getPublicationById(publicationId);
    if (updated) {
      await setPublicationIncludedItems(publicationId, updated.items.map((i) => i.id));
    }
  }

  const publication = await getPublicationById(publicationId);
  if (!publication) return { success: false, error: 'Error al actualizar', status: 500 };
  return { success: true, data: publication };
};

export const getPublicationsForMoveWithAuth = async (
  userId: string,
  moveId: string,
): Promise<ServiceResult<Publication[]>> => {
  const move = await getMoveById(moveId);
  if (!move || move.ownerId !== userId) {
    return { success: false, error: 'Mudanza no encontrada', status: 404 };
  }
  const publications = await getPublicationsByMoveId(moveId);
  return { success: true, data: publications };
};

export const getPublicationWithAuth = async (
  userId: string,
  publicationId: string,
): Promise<ServiceResult<PublicationWithItems>> => {
  const publication = await getPublicationById(publicationId);
  if (!publication || publication.ownerId !== userId) {
    return { success: false, error: 'Publicación no encontrada', status: 404 };
  }
  return { success: true, data: publication };
};

export const addItemWithAuth = async (
  userId: string,
  input: CreateItemInput,
): Promise<ServiceResult<Item>> => {
  const publication = await getPublicationById(input.publicationId);
  if (!publication || publication.ownerId !== userId) {
    return { success: false, error: 'Publicación no encontrada', status: 404 };
  }

  const item = await createItem({
    publicationId: input.publicationId,
    name: input.name,
    price: input.price,
    photoPath: input.photoPath,
    sortOrder: publication.items.length,
  });

  if (publication.type === 'bundle') {
    await setPublicationIncludedItems(input.publicationId, [
      ...publication.includedItemIds,
      item.id,
    ]);
  }

  return { success: true, data: item };
};

export const deleteItemWithAuth = async (
  userId: string,
  itemId: string,
  publicationId: string,
): Promise<ServiceResult<{ deleted: boolean }>> => {
  const publication = await getPublicationById(publicationId);
  if (!publication || publication.ownerId !== userId) {
    return { success: false, error: 'Sin permisos', status: 403 };
  }
  await deleteItem(itemId);
  return { success: true, data: { deleted: true } };
};

export const uploadItemPhotoWithAuth = async (
  userId: string,
  itemId: string,
  publicationId: string,
  file: File,
): Promise<ServiceResult<{ photoPath: string }>> => {
  const publication = await getPublicationById(publicationId);
  if (!publication || publication.ownerId !== userId) {
    return { success: false, error: 'Sin permisos', status: 403 };
  }

  const ext = file.name.split('.').pop() ?? 'jpg';
  const photoPath = `${publicationId}/${itemId}.${ext}`;
  const supabase = await createClient();

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from('item-photos')
    .upload(photoPath, arrayBuffer, { upsert: true, contentType: file.type });

  if (error) return { success: false, error: error.message, status: 500 };

  await updateItemPhoto(itemId, photoPath);
  return { success: true, data: { photoPath } };
};
