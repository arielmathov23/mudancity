import axios, { isAxiosError, type AxiosRequestConfig } from 'axios';
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

const getApiErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const payload = error.response?.data;
    if (payload && typeof payload === 'object' && 'error' in payload) {
      const message = (payload as { error?: unknown }).error;
      if (typeof message === 'string' && message.length > 0) return message;
    }
  }

  if (error instanceof Error && error.message) return error.message;
  return 'Error inesperado';
};

export const authenticatedFetch = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api.request<{ ok: true; data: T } | { error: string }>({
      url,
      ...config,
    });
    if ('error' in response.data) {
      throw new Error(response.data.error);
    }
    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export default api;
