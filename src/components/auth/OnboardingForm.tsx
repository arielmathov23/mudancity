'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { completeOnboardingAction } from '@/actions/marketplaceActions';

export const OnboardingForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await completeOnboardingAction({ phone });
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <AuthShell>
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-teal-600">Mudancity</p>
          <h1 className="mt-2 text-2xl font-bold">Completá tu perfil</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Necesitamos tu teléfono para enviar ofertas
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="bg-white" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading ? 'Guardando...' : 'Continuar'}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
};
