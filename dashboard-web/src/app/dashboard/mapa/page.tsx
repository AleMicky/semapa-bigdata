'use client';

import { ConsumptionByDistrictChart } from '@/components/dashboard/charts/consumption-by-district-chart';
import { ConsumptionByZoneChart } from '@/components/dashboard/charts/consumption-by-zone-chart';
import { ConsumptionMonthlyChart } from '@/components/dashboard/charts/consumption-monthly-chart';
import { MeterStatusChart } from '@/components/dashboard/charts/meter-status-chart';
import { TopContractsChart } from '@/components/dashboard/charts/top-contracts-chart';
import { DetailPanel } from '@/components/dashboard/detail-panel';
import { FilterPanel } from '@/components/dashboard/filter-panel';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { LoadingState, MockBanner } from '@/components/ui/States';
import {
  getConsumoMensualMapa,
  getConsumoPorDistrito,
  getConsumoPorZona,
  getDashboardResumen,
  getDistritosZonas,
  getMapaConsumo,
  getMedidoresPorEstadoMapa,
  getTopContratos,
} from '@/lib/api/dashboard.api';
import { generatePreavisoPdf } from '@/lib/pdf/preaviso-pdf';
import type { DashboardFilters, MapaPuntoConsumo } from '@/types/dashboard';
import type { Preaviso } from '@/types';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ConsumptionMap = dynamic(() => import('@/components/map/consumption-map'), {
  ssr: false,
  loading: () => <LoadingState message="Cargando mapa..." />,
});

const defaultFilters: DashboardFilters = { periodo: '2026-06' };

function puntoToPreaviso(p: MapaPuntoConsumo): Preaviso {
  return {
    id: p.id,
    contrato: p.contrato,
    titular: p.titular,
    periodo: '2026-06',
    consumoM3: p.consumoM3,
    montoBs: p.montoBs,
    estado: 'PENDIENTE',
    numeroMedidor: p.medidor,
    categoria: p.categoria,
    detalleTarifario: `Consumo periodo: ${p.consumoM3} m³ | Tarifa base Bs 4.85/m³`,
    historialConsumo: [
      { mes: 'Ene', consumo: Math.max(0, p.consumoM3 - 4) },
      { mes: 'Feb', consumo: Math.max(0, p.consumoM3 - 2) },
      { mes: 'Mar', consumo: p.consumoM3 },
      { mes: 'Abr', consumo: p.consumoM3 + 1 },
      { mes: 'May', consumo: p.consumoM3 + 2 },
      { mes: 'Jun', consumo: p.consumoM3 },
    ],
  };
}

export default function MapaConsumoPage() {
  const [draftFilters, setDraftFilters] = useState<DashboardFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>(defaultFilters);
  const [selected, setSelected] = useState<MapaPuntoConsumo | null>(null);
  const [focusPoint, setFocusPoint] = useState<MapaPuntoConsumo | null>(null);

  const { data: distritosData } = useQuery({
    queryKey: ['distritos-zonas'],
    queryFn: getDistritosZonas,
  });

  const { data: mapaData, isLoading: mapLoading } = useQuery({
    queryKey: ['mapa-consumo', appliedFilters],
    queryFn: () => getMapaConsumo(appliedFilters),
  });

  const { data: resumenData, isLoading: resumenLoading } = useQuery({
    queryKey: ['dashboard-resumen', appliedFilters],
    queryFn: () => getDashboardResumen(appliedFilters),
  });

  const { data: distritoChart } = useQuery({
    queryKey: ['consumo-distritos', appliedFilters.periodo],
    queryFn: () => getConsumoPorDistrito(appliedFilters.periodo),
  });

  const { data: zonaChart } = useQuery({
    queryKey: ['consumo-zonas', appliedFilters.distrito, appliedFilters.periodo],
    queryFn: () => getConsumoPorZona(appliedFilters.distrito, appliedFilters.periodo),
  });

  const { data: topChart } = useQuery({
    queryKey: ['top-contratos', appliedFilters.periodo],
    queryFn: () => getTopContratos(appliedFilters.periodo),
  });

  const { data: estadoChart } = useQuery({
    queryKey: ['medidores-estado-mapa'],
    queryFn: getMedidoresPorEstadoMapa,
  });

  const { data: mensualChart } = useQuery({
    queryKey: ['consumo-mensual-mapa'],
    queryFn: getConsumoMensualMapa,
  });

  const puntos = mapaData?.data ?? [];
  const fromMock =
    mapaData?.fromMock ||
    resumenData?.fromMock ||
    distritoChart?.fromMock ||
    false;

  const contratosOptions = useMemo(
    () => [...new Set(puntos.filter((p) => p.tipo !== 'RADIOBASE').map((p) => p.contrato))].slice(0, 50),
    [puntos],
  );
  const medidoresOptions = useMemo(
    () => [...new Set(puntos.filter((p) => p.tipo !== 'RADIOBASE').map((p) => p.medidor))].slice(0, 50),
    [puntos],
  );

  const handleApply = useCallback(() => {
    setAppliedFilters({ ...draftFilters });
    setSelected(null);
    setFocusPoint(null);
  }, [draftFilters]);

  useEffect(() => {
    if (!mapaData?.data) return;
    const list = mapaData.data;
    if (appliedFilters.contrato) {
      const match = list.find((p) =>
        p.contrato.toLowerCase().includes(appliedFilters.contrato!.toLowerCase()),
      );
      if (match) setFocusPoint(match);
    } else if (appliedFilters.medidor) {
      const match = list.find((p) =>
        p.medidor.toLowerCase().includes(appliedFilters.medidor!.toLowerCase()),
      );
      if (match) setFocusPoint(match);
    }
  }, [mapaData, appliedFilters.contrato, appliedFilters.medidor]);

  const handleClear = useCallback(() => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSelected(null);
    setFocusPoint(null);
  }, []);

  const handleGeneratePdf = useCallback(async (punto: MapaPuntoConsumo) => {
    await generatePreavisoPdf(puntoToPreaviso(punto));
  }, []);

  const isLoading = mapLoading || resumenLoading;

  if (isLoading && !mapaData) {
    return <LoadingState message="Cargando mapa de consumo..." />;
  }

  const resumen = resumenData?.data;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Mapa de Consumo</h1>
        <p className="text-sm text-slate-500">
          Análisis geoespacial de consumo de agua — Cochabamba, Bolivia
        </p>
      </div>

      {fromMock && <MockBanner />}

      <FilterPanel
        distritosZonas={distritosData?.data ?? []}
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={handleApply}
        onClear={handleClear}
        contratosOptions={contratosOptions}
        medidoresOptions={medidoresOptions}
      />

      {resumen && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <KpiCard label="Consumo total" value={resumen.consumoTotalM3} unit="m³" icon="💧" color="blue" />
          <KpiCard label="Consumo promedio" value={resumen.consumoPromedioM3} unit="m³" icon="📊" color="green" />
          <KpiCard label="Contratos activos" value={resumen.contratosActivos} icon="📋" color="blue" />
          <KpiCard label="Medidores activos" value={resumen.medidoresActivos} icon="📡" color="green" />
          <KpiCard label="Sin señal" value={resumen.medidoresSinSenal} icon="📵" color="gray" />
          <KpiCard label="Alertas sobreconsumo" value={resumen.alertasSobreconsumo} icon="⚠️" color="red" />
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="h-[520px] min-h-[420px]">
          {puntos.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
              No hay puntos para los filtros seleccionados.
            </div>
          ) : (
            <ConsumptionMap
              puntos={puntos}
              selectedId={selected?.id}
              focusPoint={focusPoint}
              onSelect={(p) => {
                setSelected(p);
                setFocusPoint(p);
              }}
            />
          )}
        </div>
        <div className="h-[520px] min-h-[320px]">
          <DetailPanel
            punto={selected}
            onClose={() => setSelected(null)}
            onGeneratePdf={handleGeneratePdf}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {distritoChart && <ConsumptionByDistrictChart data={distritoChart.data} />}
        {zonaChart && <ConsumptionByZoneChart data={zonaChart.data} />}
        {topChart && <TopContractsChart data={topChart.data} />}
        {estadoChart && <MeterStatusChart data={estadoChart.data} />}
        {mensualChart && (
          <div className="lg:col-span-2">
            <ConsumptionMonthlyChart data={mensualChart.data} />
          </div>
        )}
      </div>
    </div>
  );
}
