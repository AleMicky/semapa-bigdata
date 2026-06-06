'use client';

import { Card } from '@/components/ui/Card';

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Configuración</h1>
        <p className="text-sm text-slate-500">Parámetros del sistema (demo)</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Conexión API" subtitle="Backend SEMAPA BigData">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">URL API</dt>
              <dd className="font-mono text-xs">{process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Autenticación</dt>
              <dd>Mock (localStorage)</dd>
            </div>
          </dl>
        </Card>
        <Card title="Preferencias" subtitle="Visualización">
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              Mostrar banner de datos mock
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              Actualización automática cada 30s
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}
