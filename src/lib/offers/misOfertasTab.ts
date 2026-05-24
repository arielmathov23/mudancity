export const MIS_OFERTAS_PATH = '/mis-ofertas';

export const MIS_OFERTAS_TAB = {
  sent: 'enviadas',
  received: 'recibidas',
} as const;

export type MisOfertasTab = keyof typeof MIS_OFERTAS_TAB;

export const getMisOfertasPath = (tab?: MisOfertasTab): string => {
  if (!tab) return MIS_OFERTAS_PATH;
  return `${MIS_OFERTAS_PATH}?tab=${MIS_OFERTAS_TAB[tab]}`;
};

export const parseMisOfertasTab = (value: string | null): MisOfertasTab | null => {
  if (value === MIS_OFERTAS_TAB.sent || value === 'sent') return 'sent';
  if (value === MIS_OFERTAS_TAB.received || value === 'received') return 'received';
  return null;
};
