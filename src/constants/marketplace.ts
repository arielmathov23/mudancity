export type NavIcon = 'home' | 'offers' | 'account' | 'moves';

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
};

export const MAIN_NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/mi-mudanza', label: 'Mi mudanza', icon: 'moves' },
  { href: '/mis-ofertas', label: 'Mis ofertas', icon: 'offers' },
  { href: '/perfil', label: 'Perfil', icon: 'account' },
];

export const getAppNavItems = (isAuthenticated: boolean): NavItem[] => {
  if (isAuthenticated) return MAIN_NAV_ITEMS;
  return MAIN_NAV_ITEMS.map((item) =>
    item.href === '/'
      ? item
      : { ...item, href: `/login?next=${encodeURIComponent(item.href)}` },
  );
};

/** @deprecated Use getAppNavItems */
export const BUYER_NAV_ITEMS = MAIN_NAV_ITEMS;
/** @deprecated Use getAppNavItems */
export const OWNER_NAV_ITEMS = MAIN_NAV_ITEMS;
/** @deprecated Use getAppNavItems */
export const GUEST_NAV_ITEMS = getAppNavItems(false);

export const POC_WINDOW_DAYS = 7;
export const RESPONSE_SLA_HOURS = 24;

export const PUBLICATION_STATUS_LABELS = {
  open: 'Abierta',
  closed: 'Cerrada',
} as const;

export const PUBLICATION_TYPE_LABELS = {
  bundle: 'Todo el lote',
  subset: 'Subconjunto',
} as const;

export const COORDINATION_STATUS_LABELS = {
  pending: 'Pendiente',
  coordinated: 'Coordinado',
  closed: 'Cerrado',
  cancelled: 'Cancelado',
} as const;

export const OFFER_RESPONSE_LABELS = {
  accepted: 'Aceptada',
  rejected: 'Rechazada',
} as const;

export const getProductPublicPath = (publicSlug: string, itemId: string) =>
  `/p/${publicSlug}/${itemId}`;

export const COMPACT_CHIP_CLASS =
  'inline-flex h-7 items-center border px-2 py-0 text-[10px] font-medium leading-none';
