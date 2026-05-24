import { createApiLogger } from '@/lib/logger';
import { verifyAuthApp } from '@/lib/auth/verifyAuthApp';
import { validateRequest, jsonOk, jsonError } from '@/lib/validation/validateRequest';
import { respondOfferSchema } from '@/lib/validation/schemas';
import { respondToOfferWithAuth } from '@/services/offerService';

const logger = createApiLogger('offers-respond');

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const user = await verifyAuthApp();
    if (!user) return jsonError('No autorizado', 401);

    const { id } = await params;
    const body = await request.json();
    const validated = validateRequest(respondOfferSchema, body);
    if (!validated.success) return jsonError(validated.error, 400);

    const result = await respondToOfferWithAuth(user.id, id, validated.data.response);
    if (!result.success) return jsonError(result.error, result.status);
    return jsonOk(result.data);
  } catch (error) {
    logger.error({ error }, 'POST /api/offers/[id]/respond failed');
    return jsonError('Error interno', 500);
  }
};
