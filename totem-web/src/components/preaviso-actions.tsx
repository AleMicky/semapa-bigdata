'use client';

import { useState } from 'react';
import { KioskButton } from '@/components/kiosk-button';
import { QrCard } from '@/components/qr-card';
import { generateTotemPreavisoPdf, printTotemPreavisoPdf } from '@/lib/pdf/preaviso-pdf';
import type { ConsultaTipo, TotemConsultaResult } from '@/types/totem';

interface PreavisoActionsProps {
  data: TotemConsultaResult;
  consultaTipo?: ConsultaTipo;
}

export function PreavisoActions({ data, consultaTipo = 'ci' }: PreavisoActionsProps) {
  const [showQr, setShowQr] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDownload() {
    setLoading('download');
    try {
      await generateTotemPreavisoPdf(data);
    } finally {
      setLoading(null);
    }
  }

  async function handlePrint() {
    setLoading('print');
    try {
      await printTotemPreavisoPdf(data);
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <section className="rounded-3xl border-4 border-semapa-sky/20 bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-semapa-blue">Acciones</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <KioskButton onClick={handleDownload} disabled={loading !== null}>
            {loading === 'download' ? 'Generando PDF...' : 'Descargar PDF'}
          </KioskButton>
          <KioskButton variant="secondary" onClick={() => setShowQr(true)}>
            Ver QR de validación
          </KioskButton>
          <KioskButton variant="success" onClick={handlePrint} disabled={loading !== null}>
            {loading === 'print' ? 'Preparando impresión...' : 'Imprimir preaviso'}
          </KioskButton>
          <KioskButton variant="secondary" href={`/consulta?tipo=${consultaTipo}`}>
            Nueva consulta
          </KioskButton>
          <KioskButton variant="warning" href="/" className="md:col-span-2">
            Volver al inicio
          </KioskButton>
        </div>
      </section>

      {showQr && (
        <QrCard code={data.qrValidacion} expanded onClose={() => setShowQr(false)} />
      )}
    </>
  );
}
