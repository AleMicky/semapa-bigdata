'use client';

import { DashboardCharts } from '@/components/charts/DashboardCharts';
import { KpiCard } from '@/components/ui/Card';
import { LoadingState, MockBanner } from '@/components/ui/States';
import { fetchDashboardData } from '@/lib/api/dashboard.api';
import { useQuery } from '@tanstack/react-query';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  if (isLoading || !data) return <LoadingState />;

  const { kpis } = data.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard Ejecutivo</h1>
        <p className="text-sm text-slate-500">Indicadores clave de consumo y operación IoT</p>
      </div>
      {data.fromMock && <MockBanner />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Consumo total diario" value={kpis.consumoTotalDiario.toLocaleString('es-BO')} unit="m³" />
        <KpiCard label="Consumo per cápita" value={kpis.consumoPerCapita} unit="m³/hab" />
        <KpiCard label="Medidores activos" value={kpis.medidoresActivos} />
        <KpiCard label="Sensores con fallas" value={kpis.sensoresConFallas} trend="Revisar panel IoT" />
        <KpiCard label="Contratos activos" value={kpis.contratosActivos} />
        <KpiCard label="Alertas activas" value={kpis.alertasActivas} />
      </div>
      <DashboardCharts data={data.data} />
    </div>
  );
}
