'use server';

import { revalidatePath } from 'next/cache';
import { requireAuthApp } from '@/lib/auth/verifyAuthApp';
import { onboardingSchema, createMoveSchema, createPublicationSchema, createItemSchema } from '@/lib/validation/schemas';
import {
  completeOnboardingWithAuth,
  createMoveWithAuth,
  createPublicationWithAuth,
  updatePublicationWithAuth,
  addItemWithAuth,
  deleteItemWithAuth,
  uploadItemPhotoWithAuth,
  becomeOwnerWithAuth,
} from '@/services/marketplaceService';

export const completeOnboardingAction = async (input: unknown) => {
  const user = await requireAuthApp();
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.errors[0]?.message ?? 'Datos inválidos' };

  const result = await completeOnboardingWithAuth(user.id, parsed.data);
  if (!result.success) return { success: false as const, error: result.error };
  revalidatePath('/perfil');
  return { success: true as const, data: result.data };
};

export const createMoveAction = async (input: unknown) => {
  const user = await requireAuthApp();
  const parsed = createMoveSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.errors[0]?.message ?? 'Datos inválidos' };

  const result = await createMoveWithAuth(user.id, parsed.data);
  if (!result.success) return { success: false as const, error: result.error };
  revalidatePath('/mi-mudanza');
  revalidatePath(`/mi-mudanza/${result.data.id}`);
  return { success: true as const, data: result.data };
};

export const createPublicationAction = async (input: unknown) => {
  const user = await requireAuthApp();
  const parsed = createPublicationSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.errors[0]?.message ?? 'Datos inválidos' };

  const result = await createPublicationWithAuth(user.id, parsed.data);
  if (!result.success) return { success: false as const, error: result.error };
  revalidatePath(`/owner/mudanzas/${parsed.data.moveId}`);
  return { success: true as const, data: result.data };
};

export const updatePublicationAction = async (publicationId: string, input: unknown) => {
  const user = await requireAuthApp();
  const result = await updatePublicationWithAuth(user.id, publicationId, input as Parameters<typeof updatePublicationWithAuth>[2]);
  if (!result.success) return { success: false as const, error: result.error };
  revalidatePath('/mi-mudanza');
  revalidatePath(`/mi-mudanza/${result.data.moveId}`);
  revalidatePath(`/owner/publicaciones/${publicationId}`);
  revalidatePath(`/p/${result.data.publicSlug}`);
  return { success: true as const, data: result.data };
};

export const addItemAction = async (input: unknown) => {
  const user = await requireAuthApp();
  const parsed = createItemSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.errors[0]?.message ?? 'Datos inválidos' };

  const result = await addItemWithAuth(user.id, parsed.data);
  if (!result.success) return { success: false as const, error: result.error };
  revalidatePath('/mi-mudanza');
  revalidatePath(`/owner/publicaciones/${parsed.data.publicationId}`);
  return { success: true as const, data: result.data };
};

export const deleteItemAction = async (itemId: string, publicationId: string) => {
  const user = await requireAuthApp();
  const result = await deleteItemWithAuth(user.id, itemId, publicationId);
  if (!result.success) return { success: false as const, error: result.error };
  revalidatePath('/mi-mudanza');
  revalidatePath(`/owner/publicaciones/${publicationId}`);
  return { success: true as const, data: result.data };
};

export const uploadItemPhotoAction = async (formData: FormData) => {
  const user = await requireAuthApp();
  const itemId = formData.get('itemId') as string;
  const publicationId = formData.get('publicationId') as string;
  const file = formData.get('file') as File;
  if (!itemId || !publicationId || !file) {
    return { success: false as const, error: 'Archivo requerido' };
  }

  const result = await uploadItemPhotoWithAuth(user.id, itemId, publicationId, file);
  if (!result.success) return { success: false as const, error: result.error };
  revalidatePath('/mi-mudanza');
  revalidatePath(`/owner/publicaciones/${publicationId}`);
  return { success: true as const, data: result.data };
};

export const becomeOwnerAction = async () => {
  const user = await requireAuthApp();
  const result = await becomeOwnerWithAuth(user.id);
  if (!result.success) return { success: false as const, error: result.error };
  revalidatePath('/perfil');
  revalidatePath('/mi-mudanza');
  return { success: true as const, data: result.data };
};
