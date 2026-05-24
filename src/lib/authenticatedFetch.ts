import axios, { type AxiosRequestConfig } from 'axios';
import { createClient } from '@/lib/supabase/client';

const api = axios.create({ baseURL: '/api', withCredentials: true });

api.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const authenticatedFetch = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.request<{ ok: true; data: T } | { error: string }>({
    url,
    ...config,
  });
  if ('error' in response.data) {
    throw new Error(response.data.error);
  }
  return response.data.data;
};

export default api;
