'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Column, DataTable } from '@/components/ui/DataTable';
import { LoadingState, MockBanner } from '@/components/ui/States';
import { fetchMedidores } from '@/lib/api/medidores.api';
import { mapMedidorBadge } from '@/lib/mock/data';
import type { Medidor } from '@/types';
import { useQuery } from '@tanstack/react-query';

export default function MedidoresPage() {
  const { data, isLoading } = useQuery({ queryKey: ['medidores'], queryFn: fetchMedidores });

  const columns: Column<Medidor>[] = [
    { key: 'codigo', header: 'Código medidor', render: (r) => <span className="font-mono text-xs">{r.medidorIot}</span> },
    { key: 'modelo', header: 'Modelo', render: (r) => r.modelo ?? r.tipoMedidorId ?? '—' },
    { key: 'estado', header: 'Estado', render: (r) => <Badge label={mapMedidorBadge(r.estado)} /> },
    {
      key: 'instalacion',
      header: 'Fecha instalación',
      render: (r) => r.fechaInstalacion ? new Date(r.fechaInstalacion).toLocaleDateString('es-BO') : '—',
    },
    { key: 'ultima', header: 'Última lectura', render: (r) => r.ultimaLectura?.toLocaleString('es-BO') ?? '—' },
    { key: 'rb', header: 'Radiobase', render: (r) => r.radiobase ?? '—' },
    {
      key: 'senal',
      header: 'Nivel de señal',
      render: (r) => {
        const v = r.nivelSenal;
        if (v == null) return '—';
        const color = v > -70 ? 'text-emerald-600' : v > -85 ? 'text-amber-600' : 'text-red-600';
        return <span className={color}>{v} dBm</span>;
      },
    },
  ];

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Medidores IoT</h1>
        <p className="text-sm text-slate-500">Inventario y estado de medidores inteligentes</p>
      </div>
      {data?.fromMock && <MockBanner />}
      <Card>
        <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(r) => r.id} />
      </Card>
    </div>
  );
}
