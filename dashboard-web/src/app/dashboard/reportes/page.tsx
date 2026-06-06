'use client';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/States';

const reportes = [
  { id: 1, nombre: 'Consumo por distrito', descripcion: 'Reporte mensual de consumo agrupado por distrito' },
  { id: 2, nombre: 'Medidores sin señal', descripcion: 'Listado de medidores con problemas de conectividad' },
  { id: 3, nombre: 'Preavisos emitidos', descripcion: 'Resumen de preavisos generados en el período' },
  { id: 4, nombre: 'Lecturas anómalas', descripcion: 'Lecturas con estado ERROR o DUPLICADA' },
];

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Reportes</h1>
        <p className="text-sm text-slate-500">Generación de reportes operativos (demo)</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {reportes.map((r) => (
          <Card key={r.id} title={r.nombre} subtitle={r.descripcion}>
            <button
              type="button"
              onClick={() => alert(`Generando reporte: ${r.nombre} (mock)`)}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Generar reporte
            </button>
          </Card>
        ))}
      </div>
      <EmptyState
        title="Módulo de reportes avanzados"
        description="En fases futuras se integrará exportación Excel, programación de reportes y envío automático."
      />
    </div>
  );
}
