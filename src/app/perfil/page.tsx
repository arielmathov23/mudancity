import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { AccountPageClient } from '@/components/account/AccountPageClient';
import { getSessionProfile } from '@/lib/auth/session';

export default async function PerfilPage() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect('/login?next=/perfil');

  return (
    <AppShell
      header={{
        title: 'Perfil',
        description: 'Tu cuenta y preferencias',
      }}
    >
      <AccountPageClient profile={profile} email={user.email} />
    </AppShell>
  );
}
