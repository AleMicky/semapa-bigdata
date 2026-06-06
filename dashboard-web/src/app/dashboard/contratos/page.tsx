'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Column, DataTable } from '@/components/ui/DataTable';
import { LoadingState, MockBanner } from '@/components/ui/States';
import { fetchContratos } from '@/lib/api/contratos.api';
import type { Contrato } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export default function ContratosPage() {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [selected, setSelected] = useState<Contrato | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['contratos'], queryFn: fetchContratos });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.data.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.numeroContrato.toLowerCase().includes(q) ||
        c.titularContrato.toLowerCase().includes(q) ||
        (c.ciTitular ?? '').includes(q);
      const matchCat = !categoria || c.categoria === categoria;
      const matchEst = !estado || c.estadoContrato === estado;
      return matchSearch && matchCat && matchEst;
    });
  }, [data, search, categoria, estado]);

  const categorias = useMemo(
    () => [...new Set((data?.data ?? []).map((c) => c.categoria))],
    [data],
  );

  const columns: Column<Contrato>[] = [
    { key: 'numero', header: 'Nro contrato', render: (r) => r.numeroContrato },
    { key: 'titular', header: 'Titular', render: (r) => r.titularContrato },
    { key: 'ci', header: 'CI', render: (r) => r.ciTitular ?? '—' },
    { key: 'cat', header: 'Categoría', render: (r) => r.categoria },
    { key: 'estado', header: 'Estado', render: (r) => <Badge label={r.estadoContrato} /> },
    { key: 'medidor', header: 'Medidor IoT', render: (r) => r.medidorIot ?? '—' },
    { key: 'distrito', header: 'Distrito', render: (r) => r.distrito ?? '—' },
    { key: 'zona', header: 'Zona', render: (r) => r.zona ?? '—' },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelected(r)}
            className="text-xs font-medium text-sky-600 hover:underline"
          >
            Ver detalle
          </button>
          <button
            type="button"
            onClick={() => alert(`Preaviso generado para ${r.numeroContrato} (mock)`)}
            className="text-xs font-medium text-emerald-600 hover:underline"
          >
            Generar preaviso
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Contratos</h1>
        <p className="text-sm text-slate-500">Gestión de contratos de servicio de agua</p>
      </div>
      {data?.fromMock && <MockBanner />}
      <Card>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por contrato, CI o titular..."
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVO">ACTIVO</option>
            <option value="SUSPENDIDO">SUSPENDIDO</option>
          </select>
        </div>
        <DataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} />
      </Card>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900">Detalle de contrato</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Contrato</dt><dd>{selected.numeroContrato}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Titular</dt><dd>{selected.titularContrato}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">CI</dt><dd>{selected.ciTitular}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Medidor</dt><dd>{selected.medidorIot}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Distrito / Zona</dt><dd>{selected.distrito} / {selected.zona}</dd></div>
            </dl>
            <button type="button" onClick={() => setSelected(null)} className="mt-4 w-full rounded-lg bg-slate-100 py-2 text-sm font-medium">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
