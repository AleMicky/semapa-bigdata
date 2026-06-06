'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Column, DataTable } from '@/components/ui/DataTable';
import { LoadingState, MockBanner } from '@/components/ui/States';
import { fetchLecturas, simularLecturas } from '@/lib/api/lecturas.api';
import type { Lectura } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export default function LecturasPage() {
  const qc = useQueryClient();
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [medidor, setMedidor] = useState('');
  const [estado, setEstado] = useState('');
  const [simulating, setSimulating] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['lecturas'], queryFn: fetchLecturas });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.data.filter((l) => {
      const fecha = new Date(l.fechaHoraLectura);
      if (fechaDesde && fecha < new Date(fechaDesde)) return false;
      if (fechaHasta && fecha > new Date(fechaHasta + 'T23:59:59')) return false;
      if (medidor && !l.medidorIot.toLowerCase().includes(medidor.toLowerCase())) return false;
      if (estado && l.estado !== estado) return false;
      return true;
    });
  }, [data, fechaDesde, fechaHasta, medidor, estado]);

  const handleSimular = async () => {
    setSimulating(true);
    try {
      await simularLecturas(5);
      await qc.invalidateQueries({ queryKey: ['lecturas'] });
      await qc.invalidateQueries({ queryKey: ['dashboard'] });
    } finally {
      setSimulating(false);
    }
  };

  const columns: Column<Lectura>[] = [
    {
      key: 'fecha',
      header: 'Fecha hora',
      render: (r) => new Date(r.fechaHoraLectura).toLocaleString('es-BO'),
    },
    { key: 'medidor', header: 'Medidor IoT', render: (r) => r.medidorIot },
    { key: 'ant', header: 'Lectura anterior', render: (r) => r.lecturaAnterior },
    { key: 'act', header: 'Lectura actual', render: (r) => r.lecturaActual },
    { key: 'consumo', header: 'Consumo m³', render: (r) => r.consumoM3 },
    { key: 'rb', header: 'Radiobase', render: (r) => r.radiobase ?? '—' },
    { key: 'estado', header: 'Estado', render: (r) => <Badge label={r.estado} /> },
  ];

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lecturas</h1>
          <p className="text-sm text-slate-500">Registro de lecturas IoT y manuales</p>
        </div>
        <button
          type="button"
          onClick={handleSimular}
          disabled={simulating}
          className="rounded-lg bg-[#0c4a8a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a3d72] disabled:opacity-60"
        >
          {simulating ? 'Simulando...' : 'Simular lecturas'}
        </button>
      </div>
      {data?.fromMock && <MockBanner />}
      <Card>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input value={medidor} onChange={(e) => setMedidor(e.target.value)} placeholder="Medidor IoT" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">Todos los estados</option>
            <option value="NORMAL">NORMAL</option>
            <option value="ERROR">ERROR</option>
            <option value="DUPLICADA">DUPLICADA</option>
            <option value="SIN_SENAL">SIN_SEÑAL</option>
          </select>
        </div>
        <DataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} />
      </Card>
    </div>
  );
}
