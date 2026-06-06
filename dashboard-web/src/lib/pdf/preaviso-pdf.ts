import type { Preaviso } from '@/types';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

async function getPdfMake() {
  const pdfMakeModule = await import('pdfmake/build/pdfmake');
  const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfMake = pdfMakeModule.default as any;
  const pdfFonts = pdfFontsModule.default as { pdfMake?: { vfs: unknown }; vfs?: unknown };
  pdfMake.vfs = pdfFonts.pdfMake?.vfs ?? pdfFonts.vfs;
  return pdfMake as {
    createPdf: (doc: TDocumentDefinitions) => { download: (name: string) => void };
  };
}

function buildHistorialTable(preaviso: Preaviso) {
  const rows = (preaviso.historialConsumo ?? []).map((h) => [
    { text: h.mes, style: 'tableCell' },
    { text: `${h.consumo} m³`, style: 'tableCell', alignment: 'right' as const },
  ]);
  return {
    table: {
      widths: ['*', 'auto'],
      body: [
        [
          { text: 'Mes', style: 'tableHeader' },
          { text: 'Consumo', style: 'tableHeader', alignment: 'right' as const },
        ],
        ...rows,
      ],
    },
    layout: 'lightHorizontalLines',
    margin: [0, 8, 0, 8] as [number, number, number, number],
  };
}

function buildDocDefinition(preaviso: Preaviso, pageSize: string, width?: number): TDocumentDefinitions {
  const validationCode = `SEMAPA-${preaviso.contrato}-${preaviso.periodo}`.replace(/\s/g, '');

  return {
    pageSize: pageSize as 'LETTER',
    pageMargins: pageSize === 'LETTER' ? [40, 40, 40, 50] : [8, 8, 8, 8],
    ...(width ? { pageSize: { width, height: 800 } } : {}),
    defaultStyle: { fontSize: pageSize === 'LETTER' ? 10 : 7, color: '#1e293b' },
    styles: {
      logo: { fontSize: pageSize === 'LETTER' ? 22 : 10, bold: true, color: '#0c4a8a' },
      title: { fontSize: pageSize === 'LETTER' ? 14 : 8, bold: true, color: '#0369a1', margin: [0, 8, 0, 8] },
      label: { bold: true, color: '#475569' },
      tableHeader: { bold: true, fillColor: '#e0f2fe', color: '#0c4a8a', fontSize: pageSize === 'LETTER' ? 9 : 6 },
      tableCell: { fontSize: pageSize === 'LETTER' ? 9 : 6 },
      footer: { fontSize: pageSize === 'LETTER' ? 8 : 5, color: '#64748b', italics: true },
      qr: { fontSize: pageSize === 'LETTER' ? 8 : 5, color: '#334155' },
    },
    content: [
      { text: 'SEMAPA', style: 'logo' },
      { text: 'Sociedad de Gestión y Control de Aguas Potables y Alcantarillado', fontSize: pageSize === 'LETTER' ? 9 : 5, color: '#64748b' },
      { text: 'PREAVISO DE CONSUMO DE AGUA', style: 'title', alignment: 'center' },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: [{ text: 'Titular: ', style: 'label' }, preaviso.titular] },
              { text: [{ text: 'Nro. Contrato: ', style: 'label' }, preaviso.contrato], margin: [0, 4, 0, 0] },
              { text: [{ text: 'Nro. Medidor: ', style: 'label' }, preaviso.numeroMedidor ?? '—'], margin: [0, 4, 0, 0] },
              { text: [{ text: 'Período: ', style: 'label' }, preaviso.periodo], margin: [0, 4, 0, 0] },
              { text: [{ text: 'Categoría: ', style: 'label' }, preaviso.categoria ?? 'Doméstico'], margin: [0, 4, 0, 0] },
            ],
          },
          {
            width: 'auto',
            stack: [
              { text: [{ text: 'Consumo: ', style: 'label' }, `${preaviso.consumoM3} m³`], alignment: 'right' },
              { text: [{ text: 'Monto: ', style: 'label' }, `Bs ${preaviso.montoBs.toFixed(2)}`], alignment: 'right', margin: [0, 4, 0, 0], fontSize: pageSize === 'LETTER' ? 12 : 8, bold: true, color: '#0c4a8a' },
            ],
          },
        ],
      },
      { text: 'Detalle tarifario', style: 'label', margin: [0, 12, 0, 4] },
      { text: preaviso.detalleTarifario ?? 'Tarifa base aplicada según categoría vigente.', margin: [0, 0, 0, 4] },
      { text: 'Historial de consumo (últimos 6 meses)', style: 'label', margin: [0, 8, 0, 4] },
      buildHistorialTable(preaviso),
      {
        text: `Código de validación: ${validationCode}`,
        style: 'qr',
        alignment: 'center',
        margin: [0, 8, 0, 0],
      },
      {
        text: '[ QR SIMULADO — Escanee para validar en portal SEMAPA ]',
        style: 'qr',
        alignment: 'center',
        margin: [0, 4, 0, 0],
      },
    ],
    footer: () => ({
      text: 'SEMAPA Cochabamba — Av. Blanco Galindo Km. 9 — Tel. (591) 4-4299000 — www.semapa.gob.bo',
      style: 'footer',
      alignment: 'center',
      margin: [40, 0, 40, 10],
    }),
  };
}

export async function generatePreavisoPdf(preaviso: Preaviso): Promise<void> {
  const pdfMake = await getPdfMake();
  const doc = buildDocDefinition(preaviso, 'LETTER');
  pdfMake.createPdf(doc).download(`preaviso-${preaviso.contrato}-${preaviso.periodo}.pdf`);
}

export async function generateThermalPreavisoPdf(preaviso: Preaviso): Promise<void> {
  const pdfMake = await getPdfMake();
  const doc = buildDocDefinition(preaviso, 'custom', 156);
  pdfMake.createPdf(doc).download(`preaviso-termico-${preaviso.contrato}.pdf`);
}
