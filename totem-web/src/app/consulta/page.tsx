'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { KioskButton } from '@/components/kiosk-button';
import { VirtualKeyboard } from '@/components/virtual-keyboard';
import { consultarTotem } from '@/lib/api';
import {
  CONSULTA_LABELS,
  CONSULTA_PLACEHOLDERS,
  CONSULTA_STORAGE_KEY,
  isConsultaTipo,
  type ConsultaTipo,
} from '@/types/totem';

function validateInput(tipo: ConsultaTipo, valor: string): string | null {
  const trimmed = valor.trim();
  if (!trimmed) return 'Debe ingresar un dato para buscar.';

  if (tipo === 'ci' && trimmed.length < 5) {
    return 'El CI debe tener al menos 5 caracteres.';
  }

  return null;
}

function ConsultaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get('tipo');
  const tipo = isConsultaTipo(tipoParam) ? tipoParam : 'ci';

  const [valor, setValor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const titulo = useMemo(() => CONSULTA_LABELS[tipo], [tipo]);
  const placeholder = useMemo(() => CONSULTA_PLACEHOLDERS[tipo], [tipo]);

  async function handleBuscar() {
    const validationError = validateInput(tipo, valor);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    const response = await consultarTotem(tipo, valor.trim());

    setLoading(false);

    if (!response.data) {
      sessionStorage.setItem(
        CONSULTA_STORAGE_KEY,
        JSON.stringify({ tipo, valor: valor.trim(), notFound: true }),
      );
      router.push('/error');
      return;
    }

    sessionStorage.setItem(
      CONSULTA_STORAGE_KEY,
      JSON.stringify({
        tipo,
        valor: valor.trim(),
        result: response.data,
        fromMock: response.fromMock,
      }),
    );
    router.push('/resultado');
  }

  return (
    <main className="kiosk-shell">
      <header className="kiosk-header">
        <p className="kiosk-logo">SEMAPA</p>
        <h1 className="kiosk-title">{titulo}</h1>
        <p className="kiosk-subtitle">{placeholder}</p>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
        <div className="w-full rounded-3xl border-4 border-semapa-blue bg-white px-8 py-6 text-center shadow-lg">
          <p className="min-h-[56px] text-4xl font-bold tracking-wider text-slate-900 md:text-5xl">
            {valor || <span className="text-slate-300">—</span>}
          </p>
        </div>

        {error && (
          <div className="w-full rounded-2xl border-2 border-amber-400 bg-amber-50 px-6 py-4 text-center text-xl font-semibold text-amber-900">
            {error}
          </div>
        )}

        <VirtualKeyboard value={valor} onChange={setValor} tipo={tipo} />

        <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
          <KioskButton onClick={handleBuscar} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </KioskButton>
          <KioskButton variant="secondary" href="/">
            Volver
          </KioskButton>
        </div>
      </div>
    </main>
  );
}

export default function ConsultaPage() {
  return (
    <Suspense
      fallback={
        <main className="kiosk-shell items-center justify-center">
          <p className="text-3xl font-bold text-semapa-blue">Cargando...</p>
        </main>
      }
    >
      <ConsultaContent />
    </Suspense>
  );
}
