'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ConsumptionCard } from '@/components/consumption-card';
import { PreavisoActions } from '@/components/preaviso-actions';
import { QrCard } from '@/components/qr-card';
import { ResultCard } from '@/components/result-card';
import {
  CONSULTA_STORAGE_KEY,
  type ConsultaSession,
  type ConsultaTipo,
  type TotemConsultaResult,
} from '@/types/totem';

export default function ResultadoPage() {
  const router = useRouter();
  const [data, setData] = useState<TotemConsultaResult | null>(null);
  const [consultaTipo, setConsultaTipo] = useState<ConsultaTipo>('ci');
  const [fromMock, setFromMock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem(CONSULTA_STORAGE_KEY);
    if (!raw) {
      router.replace('/');
      return;
    }

    try {
      const session = JSON.parse(raw) as ConsultaSession & { notFound?: boolean };
      if (session.notFound || !session.result) {
        router.replace('/error');
        return;
      }
      setData(session.result);
      setConsultaTipo(session.tipo);
      setFromMock(Boolean(session.fromMock));
    } catch {
      router.replace('/');
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading || !data) {
    return (
      <main className="kiosk-shell items-center justify-center">
        <p className="text-3xl font-bold text-semapa-blue">Cargando resultado...</p>
      </main>
    );
  }

  return (
    <main className="kiosk-shell">
      <header className="kiosk-header">
        <p className="kiosk-logo">SEMAPA</p>
        <h1 className="kiosk-title">Resultado de consulta</h1>
        {fromMock && (
          <p className="mt-3 rounded-2xl bg-amber-100 px-6 py-3 text-xl font-semibold text-amber-900">
            Modo demostración — datos de ejemplo
          </p>
        )}
      </header>

      <div className="flex flex-col gap-8">
        <ResultCard data={data} />
        <ConsumptionCard data={data} />
        <QrCard code={data.qrValidacion} />
        <PreavisoActions data={data} consultaTipo={consultaTipo} />
      </div>
    </main>
  );
}
