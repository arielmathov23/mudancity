import pino from 'pino';

export const createApiLogger = (context: string) =>
  pino({ name: `api:${context}`, level: process.env.LOG_LEVEL ?? 'info' });

export const createServiceLogger = (context: string) =>
  pino({ name: `service:${context}`, level: process.env.LOG_LEVEL ?? 'info' });
