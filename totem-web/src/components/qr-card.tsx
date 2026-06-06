'use client';

interface QrCardProps {
  code: string;
  expanded?: boolean;
  onClose?: () => void;
}

export function QrCard({ code, expanded = false, onClose }: QrCardProps) {
  if (expanded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-8">
        <div className="w-full max-w-xl rounded-3xl border-4 border-semapa-sky bg-white p-10 text-center shadow-2xl">
          <h3 className="mb-6 text-3xl font-bold text-semapa-blue">QR de validación</h3>
          <div className="mx-auto mb-6 flex h-64 w-64 items-center justify-center rounded-2xl border-4 border-dashed border-semapa-sky bg-sky-50">
            <div className="grid grid-cols-5 gap-1 p-4">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-sm ${i % 3 === 0 ? 'bg-semapa-blue' : 'bg-white border border-slate-300'}`}
                />
              ))}
            </div>
          </div>
          <p className="break-all text-2xl font-mono font-bold text-slate-800">{code}</p>
          <p className="mt-4 text-lg text-slate-500">Escanee para validar su preaviso en portal SEMAPA</p>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="mt-8 min-h-[72px] w-full rounded-2xl bg-semapa-blue text-2xl font-bold text-white"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border-4 border-semapa-sky/20 bg-white p-8 shadow-lg">
      <h2 className="mb-4 text-3xl font-bold text-semapa-blue">Validación</h2>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border-4 border-dashed border-semapa-sky bg-sky-50">
          <div className="grid grid-cols-4 gap-0.5 p-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`h-5 w-5 ${i % 2 === 0 ? 'bg-semapa-blue' : 'bg-white border border-slate-300'}`}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-500">Código QR de validación</p>
          <p className="mt-2 break-all text-2xl font-mono font-bold text-slate-900">{code}</p>
        </div>
      </div>
    </section>
  );
}
