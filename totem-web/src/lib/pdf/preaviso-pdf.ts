import type { TotemConsultaResult } from '@/types/totem';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

async function getPdfMake() {
  const pdfMakeModule = await import('pdfmake/build/pdfmake');
  const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfMake = pdfMakeModule.default as any;
  const pdfFonts = pdfFontsModule.default as { pdfMake?: { vfs: unknown }; vfs?: unknown };
  pdfMake.vfs = pdfFonts.pdfMake?.vfs ?? pdfFonts.vfs;
  return pdfMake as {
    createPdf: (doc: TDocumentDefinitions) => {
      download: (name: string) => void;
      open: () => void;
    };
  };
}

function buildHistorialTable(data: TotemConsultaResult) {
  const rows = data.historialConsumo.map((h) => [
    { text: h.periodo, style: 'tableCell' },
    { text: `${h.consumoM3} m³`, style: 'tableCell', alignment: 'right' as const },
    { text: `Bs ${h.montoBs.toFixed(2)}`, style: 'tableCell', alignment: 'right' as const },
  ]);

  return {
    table: {
      widths: ['*', 'auto', 'auto'],
      body: [
        [
          { text: 'Período', style: 'tableHeader' },
          { text: 'Consumo', style: 'tableHeader', alignment: 'right' as const },
          { text: 'Monto', style: 'tableHeader', alignment: 'right' as const },
        ],
        ...rows,
      ],
    },
    layout: 'lightHorizontalLines',
    margin: [0, 8, 0, 8] as [number, number, number, number],
  };
}

function buildDocDefinition(data: TotemConsultaResult): TDocumentDefinitions {
  return {
    pageSize: 'LETTER',
    pageMargins: [40, 40, 40, 50],
    defaultStyle: { fontSize: 10, color: '#1e293b' },
    styles: {
      logo: { fontSize: 22, bold: true, color: '#0c4a8a' },
      title: { fontSize: 14, bold: true, color: '#0369a1', margin: [0, 8, 0, 12] },
      label: { bold: true, color: '#475569' },
      tableHeader: { bold: true, fillColor: '#e0f2fe', color: '#0c4a8a', fontSize: 9 },
      tableCell: { fontSize: 9 },
      footer: { fontSize: 8, color: '#64748b', italics: true },
      qr: { fontSize: 9, color: '#334155', alignment: 'center' as const },
      amount: { fontSize: 12, bold: true, color: '#0c4a8a' },
    },
    content: [
      { text: 'SEMAPA', style: 'logo' },
      { text: 'Preaviso de consumo de agua', style: 'title', alignment: 'center' },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: [{ text: 'Titular: ', style: 'label' }, data.titular] },
              { text: [{ text: 'CI: ', style: 'label' }, data.ci], margin: [0, 4, 0, 0] },
              { text: [{ text: 'Contrato: ', style: 'label' }, data.contrato], margin: [0, 4, 0, 0] },
              { text: [{ text: 'Medidor: ', style: 'label' }, data.medidor], margin: [0, 4, 0, 0] },
              { text: [{ text: 'Período: ', style: 'label' }, data.periodo], margin: [0, 4, 0, 0] },
            ],
          },
          {
            width: 'auto',
            stack: [
              { text: [{ text: 'Consumo: ', style: 'label' }, `${data.consumoM3} m³`], alignment: 'right' },
              { text: [{ text: 'Monto: ', style: 'label' }, `Bs ${data.montoBs.toFixed(2)}`], alignment: 'right', margin: [0, 4, 0, 0], style: 'amount' },
              { text: [{ text: 'Deuda: ', style: 'label' }, `Bs ${data.deudaBs.toFixed(2)}`], alignment: 'right', margin: [0, 4, 0, 0] },
            ],
          },
        ],
      },
      { text: 'Historial de consumo', style: 'label', margin: [0, 12, 0, 4] },
      buildHistorialTable(data),
      { text: `Código QR de validación: ${data.qrValidacion}`, style: 'qr', margin: [0, 12, 0, 0] },
      {
        text: 'Documento generado desde tótem de autoservicio ciudadano',
        style: 'footer',
        alignment: 'center',
        margin: [0, 16, 0, 0],
      },
    ],
  };
}

export async function generateTotemPreavisoPdf(data: TotemConsultaResult): Promise<void> {
  const pdfMake = await getPdfMake();
  const doc = buildDocDefinition(data);
  pdfMake.createPdf(doc).download(`preaviso-${data.contrato}-${data.periodo}.pdf`);
}

export async function printTotemPreavisoPdf(data: TotemConsultaResult): Promise<void> {
  const pdfMake = await getPdfMake();
  const doc = buildDocDefinition(data);
  pdfMake.createPdf(doc).open();
}
