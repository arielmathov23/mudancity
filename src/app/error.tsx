'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isConfigError = error.message.includes('Missing Supabase');

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center border-x border-line bg-cream-50 px-6 py-12">
      <h1 className="text-xl font-bold text-foreground">Algo salió mal</h1>
      <p className="mt-2 text-sm text-warm-muted">
        {isConfigError
          ? error.message
          : 'No pudimos cargar la página. Probá de nuevo en unos segundos.'}
      </p>
      {!isConfigError && error.digest && (
        <p className="mt-2 font-mono text-[10px] text-warm-muted">Ref: {error.digest}</p>
      )}
      <div className="mt-6 flex gap-2">
        <Button onClick={reset}>Reintentar</Button>
        <Button asChild variant="outline">
          <Link href="/">Inicio</Link>
        </Button>
      </div>
    </div>
  );
}
