const variants: Record<string, string> = {
  ACTIVO: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  INSTALADO: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  NORMAL: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PENDIENTE: 'bg-amber-100 text-amber-800 border-amber-200',
  ENVIADO: 'bg-sky-100 text-sky-800 border-sky-200',
  PAGADO: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  VENCIDO: 'bg-red-100 text-red-800 border-red-200',
  SIN_SEÑAL: 'bg-orange-100 text-orange-800 border-orange-200',
  SIN_SENAL: 'bg-orange-100 text-orange-800 border-orange-200',
  ERROR: 'bg-red-100 text-red-800 border-red-200',
  DUPLICADA: 'bg-purple-100 text-purple-800 border-purple-200',
  MANTENIMIENTO: 'bg-slate-100 text-slate-700 border-slate-200',
  SUSPENDIDO: 'bg-slate-100 text-slate-600 border-slate-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function Badge({ label }: { label: string }) {
  const key = label.toUpperCase().replace(/\s/g, '_');
  const style = variants[key] ?? variants.default;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
