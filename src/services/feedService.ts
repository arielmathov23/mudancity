import 'server-only';

import { getPublicFeedProductsPage as getPublicFeedProductsPageFromRepo } from '@/repositories/feedRepository';
import type { FeedProductsPage, FeedProductsQuery } from '@/types/feed';

export const getPublicFeedProductsPage = async (
  query: FeedProductsQuery,
): Promise<FeedProductsPage> => getPublicFeedProductsPageFromRepo(query);
