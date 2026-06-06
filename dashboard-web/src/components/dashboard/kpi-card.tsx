import { ReactNode } from 'react';

const colorMap: Record<string, string> = {
  blue: 'border-sky-200 bg-sky-50 text-sky-700',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  yellow: 'border-amber-200 bg-amber-50 text-amber-700',
  red: 'border-red-200 bg-red-50 text-red-700',
  gray: 'border-slate-200 bg-slate-50 text-slate-600',
};

export function KpiCard({
  label,
  value,
  unit,
  icon,
  color = 'blue',
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  color?: keyof typeof colorMap;
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${colorMap[color]}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">
        {typeof value === 'number' ? value.toLocaleString('es-BO') : value}
        {unit && <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span>}
      </p>
    </div>
  );
}
