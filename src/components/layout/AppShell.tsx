import { getAppNavItems } from '@/constants/marketplace';
import { getSessionProfile } from '@/lib/auth/session';
import { AppHeader } from '@/components/layout/AppHeader';
import { MobileAppShell } from '@/components/layout/MobileAppShell';
import type { AppShellProps } from '@/types/layout';

export const AppShell = async ({ children, showNav = true, header }: AppShellProps) => {
  const { user } = await getSessionProfile();
  return (
    <MobileAppShell navItems={getAppNavItems(!!user)} showNav={showNav}>
      {header && <AppHeader {...header} />}
      {children}
    </MobileAppShell>
  );
};
