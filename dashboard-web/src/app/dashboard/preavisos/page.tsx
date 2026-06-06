'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Column, DataTable } from '@/components/ui/DataTable';
import { LoadingState, MockBanner } from '@/components/ui/States';
import { fetchPreavisos } from '@/lib/api/preavisos.api';
import { generatePreavisoPdf, generateThermalPreavisoPdf } from '@/lib/pdf/preaviso-pdf';
import type { Preaviso } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function PreavisosPage() {
  const [selected, setSelected] = useState<Preaviso | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['preavisos'], queryFn: fetchPreavisos });

  const columns: Column<Preaviso>[] = [
    { key: 'contrato', header: 'Contrato', render: (r) => r.contrato },
    { key: 'titular', header: 'Titular', render: (r) => r.titular },
    { key: 'periodo', header: 'Periodo', render: (r) => r.periodo },
    { key: 'consumo', header: 'Consumo m³', render: (r) => r.consumoM3 },
    { key: 'monto', header: 'Monto Bs', render: (r) => r.montoBs.toFixed(2) },
    { key: 'estado', header: 'Estado', render: (r) => <Badge label={r.estado} /> },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (r) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setSelected(r)} className="text-xs font-medium text-sky-600 hover:underline">
            Ver detalle
          </button>
          <button type="button" onClick={() => generatePreavisoPdf(r)} className="text-xs font-medium text-emerald-600 hover:underline">
            Descargar PDF
          </button>
          <button type="button" onClick={() => generateThermalPreavisoPdf(r)} className="text-xs font-medium text-slate-600 hover:underline">
            PDF térmico
          </button>
          <button
            type="button"
            onClick={() => alert(`Notificación mock enviada a ${r.titular}`)}
            className="text-xs font-medium text-amber-600 hover:underline"
          >
            Enviar notificación
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Preavisos</h1>
        <p className="text-sm text-slate-500">Gestión de preavisos de consumo y facturación</p>
      </div>
      {data?.fromMock && <MockBanner />}
      <Card>
        <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(r) => r.id} />
      </Card>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">Detalle de preaviso</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Contrato</dt><dd>{selected.contrato}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Titular</dt><dd>{selected.titular}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Período</dt><dd>{selected.periodo}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Consumo</dt><dd>{selected.consumoM3} m³</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Monto</dt><dd>Bs {selected.montoBs.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Tarifario</dt><dd className="max-w-xs text-right">{selected.detalleTarifario}</dd></div>
            </dl>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => generatePreavisoPdf(selected)} className="flex-1 rounded-lg bg-[#0c4a8a] py-2 text-sm font-medium text-white">
                Descargar PDF
              </button>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg bg-slate-100 px-4 py-2 text-sm">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
