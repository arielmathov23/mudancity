import 'server-only';

import { createServiceLogger } from '@/lib/logger';
import type { CreateOfferInput } from '@/lib/validation/schemas';
import { getProfileById, getBuyerContactById } from '@/repositories/profileRepository';
import {
  createOffer,
  getOfferById,
  getOffersByPublicationId,
  upsertOfferResponse,
  createCoordination,
  updateCoordinationStatus,
  getAllOffersForOwner,
} from '@/repositories/offerRepository';
import { getPublicationById } from '@/repositories/publicationRepository';
import type { OfferWithDetails, ServiceResult } from '@/types/marketplace';

const logger = createServiceLogger('offerService');

export const createOfferWithAuth = async (
  userId: string,
  input: CreateOfferInput,
): Promise<ServiceResult<{ offerId: string }>> => {
  const [profile, publication] = await Promise.all([
    getProfileById(userId),
    getPublicationById(input.publicationId),
  ]);

  if (!profile?.email || !profile?.phone) {
    return { success: false, error: 'Completá email y teléfono antes de ofertar', status: 400 };
  }

  if (!publication) {
    return { success: false, error: 'Publicación no encontrada', status: 404 };
  }

  if (publication.status !== 'open') {
    return { success: false, error: 'Esta publicación está cerrada', status: 400 };
  }

  if (publication.ownerId === userId) {
    return { success: false, error: 'No podés ofertar en tu propia publicación', status: 403 };
  }

  const includedSet = new Set(publication.includedItemIds);
  const invalidItems = input.itemIds.filter((id) => !includedSet.has(id));
  if (invalidItems.length > 0 || input.itemIds.length === 0) {
    return { success: false, error: 'Selección no válida para esta publicación', status: 400 };
  }

  const offer = await createOffer({
    publicationId: input.publicationId,
    moveId: publication.moveId,
    buyerId: userId,
    offeredPrice: input.offeredPrice,
    itemIds: input.itemIds,
  });

  logger.info({ offerId: offer.id, publicationId: input.publicationId }, 'Offer created');
  return { success: true, data: { offerId: offer.id } };
};

export const respondToOfferWithAuth = async (
  userId: string,
  offerId: string,
  response: 'accepted' | 'rejected',
): Promise<ServiceResult<{ response: string; responseAt: string }>> => {
  const offer = await getOfferById(offerId);
  if (!offer) return { success: false, error: 'Oferta no encontrada', status: 404 };

  const publication = await getPublicationById(offer.publicationId);
  if (!publication || publication.ownerId !== userId) {
    return { success: false, error: 'Sin permisos', status: 403 };
  }

  if (response === 'accepted') {
    const contact = await getBuyerContactById(offer.buyerId);
    if (!contact) {
      return {
        success: false,
        error: 'El comprador no tiene contacto completo',
        status: 400,
      };
    }
  }

  const result = await upsertOfferResponse(offerId, response);

  if (result.created && response === 'accepted') {
    await createCoordination(offerId);
  }

  logger.info({ offerId, response }, 'Offer response recorded');
  return { success: true, data: { response: result.response, responseAt: result.responseAt } };
};

export const markCoordinatedWithAuth = async (
  userId: string,
  offerId: string,
): Promise<ServiceResult<{ status: string }>> => {
  const offer = await getOfferById(offerId);
  if (!offer) return { success: false, error: 'Oferta no encontrada', status: 404 };

  const publication = await getPublicationById(offer.publicationId);
  if (!publication || publication.ownerId !== userId) {
    return { success: false, error: 'Sin permisos', status: 403 };
  }

  await updateCoordinationStatus(offerId, 'coordinated');
  logger.info({ offerId }, 'Coordination marked');
  return { success: true, data: { status: 'coordinated' } };
};

export const getOffersForPublicationWithAuth = async (
  userId: string,
  publicationId: string,
): Promise<ServiceResult<OfferWithDetails[]>> => {
  const publication = await getPublicationById(publicationId);
  if (!publication || publication.ownerId !== userId) {
    return { success: false, error: 'Sin permisos', status: 403 };
  }

  const offers = await getOffersByPublicationId(publicationId);

  const enriched = await Promise.all(
    offers.map(async (offer) => {
      if (offer.response === 'accepted') {
        const contact = await getBuyerContactById(offer.buyerId);
        return { ...offer, buyerContact: contact };
      }
      return offer;
    }),
  );

  return { success: true, data: enriched };
};

export const getAllOffersForOwnerWithAuth = async (
  userId: string,
): Promise<ServiceResult<OfferWithDetails[]>> => {
  const offers = await getAllOffersForOwner(userId);

  const enriched = await Promise.all(
    offers.map(async (offer) => {
      if (offer.response === 'accepted') {
        const contact = await getBuyerContactById(offer.buyerId);
        return { ...offer, buyerContact: contact };
      }
      return offer;
    }),
  );

  return { success: true, data: enriched };
};
