import { NextResponse } from 'next/server';
import { createApiLogger } from '@/lib/logger';
import { verifyAuthApp } from '@/lib/auth/verifyAuthApp';
import { validateRequest, jsonOk, jsonError } from '@/lib/validation/validateRequest';
import { createOfferSchema, respondOfferSchema, updateCoordinationSchema } from '@/lib/validation/schemas';
import {
  createOfferWithAuth,
  respondToOfferWithAuth,
  markCoordinatedWithAuth,
  getOffersForPublicationWithAuth,
  getAllOffersForOwnerWithAuth,
} from '@/services/offerService';

const logger = createApiLogger('offers');

export const POST = async (request: Request) => {
  try {
    const user = await verifyAuthApp(request);
    if (!user) return jsonError('No autorizado', 401);

    const body = await request.json();
    const validated = validateRequest(createOfferSchema, body);
    if (!validated.success) return jsonError(validated.error, 400);

    const result = await createOfferWithAuth(user.id, validated.data, {
      authEmail: user.email,
      request,
    });
    if (!result.success) return jsonError(result.error, result.status);
    return jsonOk(result.data, 201);
  } catch (error) {
    logger.error({ error }, 'POST /api/offers failed');
    return jsonError('Error interno', 500);
  }
};

export const GET = async (request: Request) => {
  try {
    const user = await verifyAuthApp();
    if (!user) return jsonError('No autorizado', 401);

    const { searchParams } = new URL(request.url);
    const publicationId = searchParams.get('publicationId');

    if (publicationId) {
      const result = await getOffersForPublicationWithAuth(user.id, publicationId);
      if (!result.success) return jsonError(result.error, result.status);
      return jsonOk(result.data);
    }

    const result = await getAllOffersForOwnerWithAuth(user.id);
    if (!result.success) return jsonError(result.error, result.status);
    return jsonOk(result.data);
  } catch (error) {
    logger.error({ error }, 'GET /api/offers failed');
    return jsonError('Error interno', 500);
  }
};
