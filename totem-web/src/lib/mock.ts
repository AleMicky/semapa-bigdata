import type { ConsultaTipo, TotemConsultaResult } from '@/types/totem';

const BASE_HISTORIAL = [
  { periodo: '2025-12', consumoM3: 22.4, montoBs: 55.2 },
  { periodo: '2026-01', consumoM3: 24.1, montoBs: 60.4 },
  { periodo: '2026-02', consumoM3: 21.8, montoBs: 53.1 },
  { periodo: '2026-03', consumoM3: 26.7, montoBs: 68.9 },
  { periodo: '2026-04', consumoM3: 25.3, montoBs: 64.7 },
  { periodo: '2026-05', consumoM3: 28.5, montoBs: 73.5 },
];

export function getMockTotemResult(tipo: ConsultaTipo, valor: string): TotemConsultaResult {
  const contrato = tipo === 'contrato' ? `C-${valor.replace(/^C-?/i, '')}` : 'C-10001';
  const medidor = tipo === 'medidor' ? valor.toUpperCase() : 'MED-0001';
  const ci = tipo === 'ci' ? valor : '1234567';

  return {
    titular: 'Juan Pérez Mendoza',
    ci,
    contrato,
    medidor,
    categoria: 'DOMESTICO',
    direccion: 'Av. Blanco Galindo',
    zona: 'Zona Norte',
    distrito: 'Distrito 1',
    periodo: '2026-05',
    consumoM3: 28.5,
    montoBs: 73.5,
    deudaBs: 73.5,
    estadoContrato: 'ACTIVO',
    ultimaFechaPago: '2026-04-30',
    qrValidacion: `SEMAPA-${contrato}-2026-05`,
    historialConsumo: BASE_HISTORIAL,
  };
}
