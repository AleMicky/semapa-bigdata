'use client';

import type { DashboardFilters, DistritoZona } from '@/types/dashboard';
import { useMemo } from 'react';

const PERIODOS = [
  { value: '2026-06', label: 'Junio 2026' },
  { value: '2026-05', label: 'Mayo 2026' },
  { value: '2026-04', label: 'Abril 2026' },
  { value: '2026-03', label: 'Marzo 2026' },
];

interface FilterPanelProps {
  distritosZonas: DistritoZona[];
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
  onApply: () => void;
  onClear: () => void;
  contratosOptions?: string[];
  medidoresOptions?: string[];
}

export function FilterPanel({
  distritosZonas,
  filters,
  onChange,
  onApply,
  onClear,
  contratosOptions = [],
  medidoresOptions = [],
}: FilterPanelProps) {
  const zonas = useMemo(() => {
    if (!filters.distrito) return distritosZonas.flatMap((d) => d.zonas);
    return distritosZonas.find((d) => d.distrito === filters.distrito)?.zonas ?? [];
  }, [distritosZonas, filters.distrito]);

  const update = (patch: Partial<DashboardFilters>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Filtros de análisis</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div>
          <label htmlFor="filtro-distrito" className="mb-1 block text-xs font-medium text-slate-500">
            Distrito
          </label>
          <select
            id="filtro-distrito"
            value={filters.distrito ?? ''}
            onChange={(e) => update({ distrito: e.target.value || undefined, zona: undefined })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="">Todos</option>
            {distritosZonas.map((d) => (
              <option key={d.distrito} value={d.distrito}>
                {d.distrito}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filtro-zona" className="mb-1 block text-xs font-medium text-slate-500">
            Zona
          </label>
          <select
            id="filtro-zona"
            value={filters.zona ?? ''}
            onChange={(e) => update({ zona: e.target.value || undefined })}
            disabled={!filters.distrito}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50"
          >
            <option value="">Todas</option>
            {zonas.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filtro-contrato" className="mb-1 block text-xs font-medium text-slate-500">
            Contrato
          </label>
          <input
            id="filtro-contrato"
            list="contratos-list"
            value={filters.contrato ?? ''}
            onChange={(e) => update({ contrato: e.target.value || undefined })}
            placeholder="CTR-00001"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <datalist id="contratos-list">
            {contratosOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="filtro-medidor" className="mb-1 block text-xs font-medium text-slate-500">
            Medidor
          </label>
          <input
            id="filtro-medidor"
            list="medidores-list"
            value={filters.medidor ?? ''}
            onChange={(e) => update({ medidor: e.target.value || undefined })}
            placeholder="IOT-00001"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <datalist id="medidores-list">
            {medidoresOptions.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="filtro-periodo" className="mb-1 block text-xs font-medium text-slate-500">
            Periodo
          </label>
          <select
            id="filtro-periodo"
            value={filters.periodo ?? '2026-06'}
            onChange={(e) => update({ periodo: e.target.value || undefined })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {PERIODOS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1 xl:col-span-1">
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-lg bg-[#0c4a8a] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a3d72]"
          >
            Aplicar filtros
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
