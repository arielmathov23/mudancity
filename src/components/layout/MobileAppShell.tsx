import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { GridRuler } from '@/components/layout/GridRuler';
import type { NavItem } from '@/constants/marketplace';

interface MobileAppShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  showNav?: boolean;
}

export const MobileAppShell = ({ children, navItems, showNav = true }: MobileAppShellProps) => (
  <div className="relative min-h-screen bg-cream">
    <main
      className={`relative mx-auto min-h-screen max-w-md border-x border-line bg-cream-50 px-4 pt-4 ${showNav ? 'pb-28' : 'pb-6'}`}
    >
      <GridRuler />
      {children}
    </main>
    {showNav && <MobileNavBar items={navItems} />}
  </div>
);
