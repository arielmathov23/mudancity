import { createApiLogger } from '@/lib/logger';
import { FEED_PAGE_SIZE } from '@/constants/feed';
import { jsonError, jsonOk, validateRequest } from '@/lib/validation/validateRequest';
import { feedProductsQuerySchema } from '@/lib/validation/schemas';
import { getPublicFeedProductsPage } from '@/services/feedService';

const logger = createApiLogger('feed-products');

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const validation = validateRequest(feedProductsQuerySchema, {
      moveId: searchParams.get('moveId') ?? undefined,
      offset: searchParams.get('offset') ?? 0,
      limit: searchParams.get('limit') ?? undefined,
    });

    if (!validation.success) return jsonError(validation.error, 400);

    const { moveId, offset = 0, limit = FEED_PAGE_SIZE } = validation.data;
    const page = await getPublicFeedProductsPage({ moveId, offset, limit });
    return jsonOk(page);
  } catch (error) {
    logger.error({ error }, 'GET /api/feed/products failed');
    return jsonError('Error interno', 500);
  }
};
