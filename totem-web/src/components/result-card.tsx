import type { TotemConsultaResult } from '@/types/totem';

interface ResultCardProps {
  data: TotemConsultaResult;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-5 py-4">
      <p className="text-lg font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export function ResultCard({ data }: ResultCardProps) {
  return (
    <section className="rounded-3xl border-4 border-semapa-sky/20 bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-semapa-blue">Datos del titular</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre completo" value={data.titular} />
        <Field label="CI" value={data.ci} />
        <Field label="Número de contrato" value={data.contrato} />
        <Field label="Número de medidor" value={data.medidor} />
        <Field label="Categoría" value={data.categoria} />
        <Field label="Dirección" value={data.direccion} />
        <Field label="Zona" value={data.zona} />
        <Field label="Distrito" value={data.distrito} />
      </div>
    </section>
  );
}
