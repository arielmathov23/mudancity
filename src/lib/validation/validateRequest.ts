import { NextResponse } from 'next/server';
import { type ZodSchema } from 'zod';

export const validateRequest = <T>(
  schema: ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } => {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message ?? 'Datos inválidos' };
  }
  return { success: true, data: result.data };
};

export const jsonOk = <T>(data: T, status = 200) =>
  NextResponse.json({ ok: true, data }, { status });

export const jsonError = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });
