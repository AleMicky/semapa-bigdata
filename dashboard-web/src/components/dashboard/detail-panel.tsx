'use client';

import type { MapaPuntoConsumo } from '@/types/dashboard';
import Link from 'next/link';

const estadoLabels: Record<MapaPuntoConsumo['estado'], string> = {
  NORMAL: 'Consumo normal',
  ALTO: 'Consumo alto',
  SOBRECONSUMO: 'Sobreconsumo',
  SIN_SENAL: 'Sin señal',
};

const estadoColors: Record<MapaPuntoConsumo['estado'], string> = {
  NORMAL: 'bg-emerald-100 text-emerald-800',
  ALTO: 'bg-amber-100 text-amber-800',
  SOBRECONSUMO: 'bg-red-100 text-red-800',
  SIN_SENAL: 'bg-slate-200 text-slate-600',
};

interface DetailPanelProps {
  punto: MapaPuntoConsumo | null;
  onClose: () => void;
  onGeneratePdf?: (punto: MapaPuntoConsumo) => void;
}

export function DetailPanel({ punto, onClose, onGeneratePdf }: DetailPanelProps) {
  if (!punto || punto.tipo === 'RADIOBASE') {
    return (
      <aside className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-800">Detalle del punto</h3>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-sm text-slate-500">
          <p>Seleccione un marcador en el mapa para ver el detalle del contrato o medidor.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">Detalle del punto</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Cerrar detalle"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <p className="text-xs text-slate-500">Titular</p>
          <p className="font-semibold text-slate-900">{punto.titular}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-500">CI</p>
            <p className="font-medium">{punto.ci ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Categoría</p>
            <p className="font-medium">{punto.categoria ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Contrato</p>
            <p className="font-medium">{punto.contrato}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Medidor</p>
            <p className="font-medium">{punto.medidor}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-500">Dirección</p>
            <p className="font-medium">{punto.direccion ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Distrito</p>
            <p className="font-medium">{punto.distrito}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Zona</p>
            <p className="font-medium">{punto.zona}</p>
          </div>
        </div>

        <div className="rounded-lg bg-sky-50 p-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Consumo del periodo</span>
            <span className="font-bold text-sky-800">{punto.consumoM3} m³</span>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-slate-600">Monto Bs</span>
            <span className="font-bold text-sky-800">{punto.montoBs.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoColors[punto.estado]}`}
          >
            {estadoLabels[punto.estado]}
          </span>
          {punto.ultimaLectura && (
            <p className="mt-2 text-xs text-slate-500">
              Última lectura:{' '}
              {new Date(punto.ultimaLectura).toLocaleString('es-BO', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-100 p-4">
        <Link
          href={`/dashboard/contratos?search=${encodeURIComponent(punto.contrato)}`}
          className="block w-full rounded-lg border border-sky-200 bg-sky-50 py-2 text-center text-sm font-medium text-sky-800 hover:bg-sky-100"
        >
          Ver contrato
        </Link>
        <Link
          href={`/dashboard/lecturas?medidor=${encodeURIComponent(punto.medidor)}`}
          className="block w-full rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Ver historial
        </Link>
        <button
          type="button"
          onClick={() => onGeneratePdf?.(punto)}
          className="w-full rounded-lg bg-[#0c4a8a] py-2 text-sm font-medium text-white hover:bg-[#0a3d72]"
        >
          Generar preaviso PDF
        </button>
      </div>
    </aside>
  );
}
