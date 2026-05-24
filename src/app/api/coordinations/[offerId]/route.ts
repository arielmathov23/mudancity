import { createApiLogger } from '@/lib/logger';
import { verifyAuthApp } from '@/lib/auth/verifyAuthApp';
import { validateRequest, jsonOk, jsonError } from '@/lib/validation/validateRequest';
import { updateCoordinationSchema } from '@/lib/validation/schemas';
import { markCoordinatedWithAuth } from '@/services/offerService';

const logger = createApiLogger('coordinations');

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ offerId: string }> },
) => {
  try {
    const user = await verifyAuthApp();
    if (!user) return jsonError('No autorizado', 401);

    const { offerId } = await params;
    const body = await request.json();
    const validated = validateRequest(updateCoordinationSchema, body);
    if (!validated.success) return jsonError(validated.error, 400);

    if (validated.data.status !== 'coordinated') {
      return jsonError('Estado no soportado en MVP', 400);
    }

    const result = await markCoordinatedWithAuth(user.id, offerId);
    if (!result.success) return jsonError(result.error, result.status);
    return jsonOk(result.data);
  } catch (error) {
    logger.error({ error }, 'PATCH /api/coordinations failed');
    return jsonError('Error interno', 500);
  }
};
