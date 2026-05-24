import { z } from 'zod';

export const createMoveSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(120),
});

export const createPublicationSchema = z.object({
  moveId: z.string().uuid(),
  title: z.string().min(1, 'El título es obligatorio').max(120),
  description: z.string().max(500).optional(),
  type: z.enum(['bundle', 'subset']),
  status: z.enum(['open', 'closed']).default('open'),
});

export const updatePublicationSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['open', 'closed']).optional(),
  type: z.enum(['bundle', 'subset']).optional(),
  includedItemIds: z.array(z.string().uuid()).optional(),
});

export const createItemSchema = z.object({
  publicationId: z.string().uuid(),
  name: z.string().min(1, 'El nombre es obligatorio').max(120),
  price: z.number().positive('El precio debe ser mayor a 0'),
  photoPath: z.string().optional(),
});

export const createOfferSchema = z.object({
  publicationId: z.string().uuid(),
  offeredPrice: z.number().positive('El precio debe ser mayor a 0'),
  itemIds: z.array(z.string().uuid()).min(1, 'Seleccioná al menos un ítem'),
});

export const respondOfferSchema = z.object({
  response: z.enum(['accepted', 'rejected']),
});

export const updateCoordinationSchema = z.object({
  status: z.enum(['coordinated', 'closed', 'cancelled']),
});

export const onboardingSchema = z.object({
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono inválido').max(20),
  displayName: z.string().max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const registerSchema = loginSchema.extend({
  displayName: z.string().min(1).max(80).optional(),
});

export type CreateMoveInput = z.infer<typeof createMoveSchema>;
export type CreatePublicationInput = z.infer<typeof createPublicationSchema>;
export type UpdatePublicationInput = z.infer<typeof updatePublicationSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type RespondOfferInput = z.infer<typeof respondOfferSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
