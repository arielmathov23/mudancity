'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { setAuthNextCookie } from '@/lib/auth/redirect';
import { createClient } from '@/lib/supabase/client';
import { AuthShell } from '@/components/layout/AuthShell';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const mode = searchParams.get('mode');
  const [isRegister, setIsRegister] = useState(mode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const result = isRegister
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    router.push(next);
    router.refresh();
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    setAuthNextCookie(next);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <AuthShell>
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-teal-600">Mudancity</p>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900">
            {isRegister ? 'Crear cuenta' : 'Ingresar'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Accedé para ofertar o gestionar tu mudanza
          </p>
        </div>

        <Button
          variant="outline"
          className="h-11 w-full gap-3 bg-white font-normal"
          onClick={handleGoogle}
          type="button"
        >
          <GoogleIcon />
          Continuar con Google
        </Button>

        <div className="relative text-center text-xs text-neutral-400">
          <span className="relative z-10 bg-neutral-100 px-2">o con email</span>
          <div className="absolute inset-x-0 top-1/2 border-t border-neutral-200" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-white"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading ? 'Procesando...' : isRegister ? 'Registrarme' : 'Ingresar'}
          </Button>
        </form>

        <button
          type="button"
          className="w-full text-sm text-teal-600"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? '¿Ya tenés cuenta? Ingresá' : '¿No tenés cuenta? Registrate'}
        </button>

        <Link href="/" className="block text-center text-sm text-neutral-500">
          Volver al inicio
        </Link>
      </div>
    </AuthShell>
  );
};
