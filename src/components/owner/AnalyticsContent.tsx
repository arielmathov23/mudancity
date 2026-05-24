'use client';

import { format } from 'date-fns';
import { SectionNumber } from '@/components/layout/GridRuler';
import { Card, CardContent } from '@/components/ui/card';
import { POC_WINDOW_DAYS } from '@/constants/marketplace';
import { useAnalytics } from '@/hooks/useOffers';

export const AnalyticsContent = () => {
  const { data: kpis, isLoading } = useAnalytics();
  const pct = (n: number) => `${Math.round(n * 100)}%`;

  return (
    <div className="space-y-4">
      <div>
        <SectionNumber number="03" />
        <h1 className="text-xl font-bold">Analytics POC</h1>
        <p className="text-sm text-neutral-500">Ventana de {POC_WINDOW_DAYS} días desde primera publicación</p>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Cargando...</p>}

      {kpis?.map((kpi) => (
        <Card key={kpi.moveId}>
          <CardContent className="space-y-3 pt-4">
            <p className="font-semibold">{kpi.moveTitle}</p>
            <p className="text-xs text-neutral-500">
              {format(new Date(kpi.windowStart), 'd/M/yy')} — {format(new Date(kpi.windowEnd), 'd/M/yy')}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-neutral-500">Publicaciones con oferta</p>
                <p className="text-lg font-bold text-teal-600">{pct(kpi.offerRate)}</p>
                <p className="text-xs">{kpi.publicationsWithOffers}/{kpi.totalPublications}</p>
              </div>
              <div>
                <p className="text-neutral-500">Respuesta &lt;24h</p>
                <p className="text-lg font-bold text-teal-600">{pct(kpi.responseRateUnder24h)}</p>
                <p className="text-xs">{kpi.responsesUnder24h}/{kpi.totalOffers} ofertas</p>
              </div>
              <div>
                <p className="text-neutral-500">Coordinación real</p>
                <p className="text-lg font-bold text-teal-600">{pct(kpi.coordinationRate)}</p>
                <p className="text-xs">{kpi.coordinatedOffers}/{kpi.acceptedOffers} aceptadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {!isLoading && (!kpis || kpis.length === 0) && (
        <p className="text-sm text-neutral-500">Creá una mudanza y publicaciones para ver KPIs.</p>
      )}
    </div>
  );
};
