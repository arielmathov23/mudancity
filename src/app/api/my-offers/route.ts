import { createApiLogger } from '@/lib/logger';
import { verifyAuthApp } from '@/lib/auth/verifyAuthApp';
import { jsonOk, jsonError } from '@/lib/validation/validateRequest';
import { getOffersByBuyerId } from '@/repositories/offerRepository';

const logger = createApiLogger('my-offers');

export const GET = async () => {
  try {
    const user = await verifyAuthApp();
    if (!user) return jsonError('No autorizado', 401);

    const offers = await getOffersByBuyerId(user.id);
    return jsonOk(offers);
  } catch (error) {
    logger.error({ error }, 'GET /api/my-offers failed');
    return jsonError('Error interno', 500);
  }
};
