import { createApiLogger } from '@/lib/logger';
import { verifyAuthApp } from '@/lib/auth/verifyAuthApp';
import { jsonOk, jsonError } from '@/lib/validation/validateRequest';
import { getAnalyticsWithAuth } from '@/services/analyticsService';

const logger = createApiLogger('analytics');

export const GET = async () => {
  try {
    const user = await verifyAuthApp();
    if (!user) return jsonError('No autorizado', 401);

    const result = await getAnalyticsWithAuth(user.id);
    if (!result.success) return jsonError(result.error, result.status);
    return jsonOk(result.data);
  } catch (error) {
    logger.error({ error }, 'GET /api/analytics failed');
    return jsonError('Error interno', 500);
  }
};
