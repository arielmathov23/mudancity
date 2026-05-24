import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { createClientFromRequest } from '@/lib/supabase/routeHandler';

export type AuthUser = {
  id: string;
  email?: string;
};

export const verifyAuthApp = async (request?: Request): Promise<AuthUser | null> => {
  const supabase = request ? await createClientFromRequest(request) : await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email };
};

export const requireAuthApp = async (): Promise<AuthUser> => {
  const user = await verifyAuthApp();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
};
