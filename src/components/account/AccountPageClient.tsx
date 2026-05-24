'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { becomeOwnerAction } from '@/actions/marketplaceActions';
import type { Profile } from '@/types/marketplace';

interface AccountPageClientProps {
  profile: Profile | null;
  email?: string;
}

export const AccountPageClient = ({ profile, email }: AccountPageClientProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleBecomeOwner = async () => {
    await becomeOwnerAction();
    router.push('/mi-mudanza');
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-2 pt-4 text-sm">
          <p><span className="text-neutral-500">Email auth:</span> {email ?? '—'}</p>
          <p><span className="text-neutral-500">Contacto:</span> {profile?.email ?? '—'}</p>
          <p><span className="text-neutral-500">Teléfono:</span> {profile?.phone ?? '—'}</p>
          <p><span className="text-neutral-500">Rol:</span> {profile?.role ?? 'buyer'}</p>
        </CardContent>
      </Card>

      {profile?.role !== 'owner' && (
        <Button variant="outline" className="w-full" onClick={handleBecomeOwner}>
          Quiero vender en mi mudanza
        </Button>
      )}

      <Button variant="destructive" className="w-full" onClick={handleSignOut}>
        Cerrar sesión
      </Button>
    </div>
  );
};
