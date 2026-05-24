import { AppShell } from '@/components/layout/AppShell';
import { MyOffersContent } from '@/components/buyer/MyOffersContent';
import { getSessionProfile } from '@/lib/auth/session';

export default async function MyOffersPage() {
  const { profile } = await getSessionProfile();
  const isOwner = profile?.role === 'owner';

  return (
    <AppShell
      header={{
        title: 'Mis ofertas',
        description: isOwner
          ? 'Enviadas y recibidas en tus publicaciones'
          : 'Ofertas que enviaste',
      }}
    >
      <MyOffersContent isOwner={isOwner} defaultTab={isOwner ? 'received' : 'sent'} />
    </AppShell>
  );
}
