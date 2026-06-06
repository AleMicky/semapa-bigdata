'use client';

import { useEffect, useState } from 'react';
import { KioskButton } from '@/components/kiosk-button';
import { CONSULTA_STORAGE_KEY, isConsultaTipo, type ConsultaTipo } from '@/types/totem';

export default function ErrorPage() {
  const [tipo, setTipo] = useState<ConsultaTipo>('ci');

  useEffect(() => {
    const raw = sessionStorage.getItem(CONSULTA_STORAGE_KEY);
    if (!raw) return;

    try {
      const session = JSON.parse(raw) as { tipo?: string };
      if (session.tipo && isConsultaTipo(session.tipo)) {
        setTipo(session.tipo);
      }
    } catch {
      // mantener valor por defecto
    }
  }, []);

  return (
    <main className="kiosk-shell items-center justify-center text-center">
      <div className="w-full max-w-3xl rounded-3xl border-4 border-amber-300 bg-white p-12 shadow-xl">
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-amber-100 text-6xl">
          !
        </div>
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Sin resultados</h1>
        <p className="mt-6 text-2xl leading-relaxed text-slate-600 md:text-3xl">
          No se encontró información con el dato ingresado.
        </p>
        <p className="mt-4 text-xl text-slate-500">
          Verifique el número e intente nuevamente.
        </p>

        <div className="mt-10 grid gap-4">
          <KioskButton href={`/consulta?tipo=${tipo}`}>Intentar nuevamente</KioskButton>
          <KioskButton variant="secondary" href="/">
            Volver al inicio
          </KioskButton>
        </div>
      </div>
    </main>
  );
}
