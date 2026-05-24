'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import type { NavItem } from '@/constants/marketplace';
import {
  HomeIcon,
  OffersIcon,
  AccountIcon,
  MovesIcon,
} from '@/components/icons/NavIcons';

const ICON_MAP = {
  home: HomeIcon,
  offers: OffersIcon,
  account: AccountIcon,
  moves: MovesIcon,
};

interface MobileNavBarProps {
  items: NavItem[];
}

const isNavActive = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/';
  const base = href.split('?')[0];
  return pathname === base || pathname.startsWith(`${base}/`);
};

export const MobileNavBar = ({ items }: MobileNavBarProps) => {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
      <nav
        aria-label="Navegación principal"
        className="nav-glass w-full max-w-md border-x border-line pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4 divide-x divide-line">
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-medium transition-colors',
                  active ? 'bg-cream-100 text-teal-700' : 'text-warm-muted hover:bg-cream-100 hover:text-foreground',
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'scale-105')} />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
