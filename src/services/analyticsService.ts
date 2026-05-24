import 'server-only';

import { computeKpisForOwner } from '@/repositories/analyticsRepository';
import type { MoveKpis, ServiceResult } from '@/types/marketplace';

export const getAnalyticsWithAuth = async (
  userId: string,
): Promise<ServiceResult<MoveKpis[]>> => {
  const kpis = await computeKpisForOwner(userId);
  return { success: true, data: kpis };
};
