import type { TotemConsultaResult } from '@/types/totem';

interface ConsumptionCardProps {
  data: TotemConsultaResult;
}

function formatBs(amount: number) {
  return `Bs ${amount.toFixed(2)}`;
}

function estadoColor(estado: string) {
  const normalized = estado.toUpperCase();
  if (normalized === 'ACTIVO' || normalized === 'AL DIA' || normalized === 'AL DÍA') {
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  }
  if (normalized.includes('MORA') || normalized.includes('SUSPEND')) {
    return 'bg-red-100 text-red-800 border-red-300';
  }
  return 'bg-amber-100 text-amber-900 border-amber-300';
}

export function ConsumptionCard({ data }: ConsumptionCardProps) {
  const maxConsumo = Math.max(...data.historialConsumo.map((h) => h.consumoM3), 1);
  const hasDeuda = data.deudaBs > 0;

  return (
    <section className="rounded-3xl border-4 border-semapa-sky/20 bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-semapa-blue">Datos de consumo</h2>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-sky-50 px-5 py-4">
          <p className="text-lg font-semibold text-slate-500">Período</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{data.periodo}</p>
        </div>
        <div className="rounded-2xl bg-sky-50 px-5 py-4">
          <p className="text-lg font-semibold text-slate-500">Consumo actual</p>
          <p className="mt-1 text-2xl font-bold text-semapa-blue">{data.consumoM3} m³</p>
        </div>
        <div className="rounded-2xl bg-sky-50 px-5 py-4">
          <p className="text-lg font-semibold text-slate-500">Monto</p>
          <p className="mt-1 text-2xl font-bold text-semapa-blue">{formatBs(data.montoBs)}</p>
        </div>
        <div className={`rounded-2xl border-2 px-5 py-4 ${hasDeuda ? 'border-amber-300 bg-amber-50' : 'border-emerald-300 bg-emerald-50'}`}>
          <p className="text-lg font-semibold text-slate-500">Deuda pendiente</p>
          <p className={`mt-1 text-2xl font-bold ${hasDeuda ? 'text-amber-700' : 'text-emerald-700'}`}>
            {formatBs(data.deudaBs)}
          </p>
        </div>
        <div className={`rounded-2xl border-2 px-5 py-4 ${estadoColor(data.estadoContrato)}`}>
          <p className="text-lg font-semibold opacity-80">Estado del contrato</p>
          <p className="mt-1 text-2xl font-bold">{data.estadoContrato}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-5 py-4">
          <p className="text-lg font-semibold text-slate-500">Última fecha de pago</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{data.ultimaFechaPago}</p>
        </div>
      </div>

      <h3 className="mb-4 text-2xl font-bold text-semapa-blue">Historial — últimos 6 meses</h3>
      <div className="space-y-4">
        {data.historialConsumo.map((item) => {
          const width = `${Math.round((item.consumoM3 / maxConsumo) * 100)}%`;
          return (
            <div key={item.periodo} className="rounded-2xl bg-slate-50 px-5 py-4">
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-xl font-bold text-slate-800">{item.periodo}</span>
                <span className="text-xl font-semibold text-semapa-blue">
                  {item.consumoM3} m³ · {formatBs(item.montoBs)}
                </span>
              </div>
              <div className="h-6 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-semapa-sky to-semapa-blue transition-all"
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
