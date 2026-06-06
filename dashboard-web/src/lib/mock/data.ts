import type {
  Contrato,
  DashboardData,
  Lectura,
  Medidor,
  Preaviso,
} from '@/types';

export const mockContratos: Contrato[] = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  return {
    id: `mock-contrato-${n}`,
    numeroContrato: `CTR-${String(n).padStart(5, '0')}`,
    titularContrato: `Titular Demo ${n}`,
    ciTitular: `${10000000 + n}`,
    categoria: ['Doméstico', 'Comercial', 'Industrial'][i % 3],
    estadoContrato: i % 7 === 0 ? 'SUSPENDIDO' : 'ACTIVO',
    medidorIot: `IOT-${String(n).padStart(5, '0')}`,
    distrito: ['Centro', 'Norte', 'Sur', 'Este', 'Oeste'][i % 5],
    zona: `Zona ${(i % 4) + 1}`,
  };
});

export const mockMedidores: Medidor[] = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  const estados = ['INSTALADO', 'INSTALADO', 'INSTALADO', 'MANTENIMIENTO', 'ERROR'];
  return {
    id: `mock-medidor-${n}`,
    medidorIot: `IOT-${String(n).padStart(5, '0')}`,
    tipoMedidorId: `TM-${(i % 5) + 1}`,
    modelo: ['Sensus iPERL', 'Kamstrup flowIQ', 'Diehl Metering', 'Elster V100', 'Itron Cyble'][i % 5],
    fechaInstalacion: `2023-${String((i % 12) + 1).padStart(2, '0')}-15`,
    estado: estados[i % estados.length],
    ultimaLectura: 100 + n * 12,
    radiobase: `RB-${String((i % 8) + 1).padStart(3, '0')}`,
    nivelSenal: i % 4 === 0 ? -95 : -65 - (i % 20),
  };
});

export const mockLecturas: Lectura[] = Array.from({ length: 30 }, (_, i) => {
  const n = (i % 20) + 1;
  const anterior = 100 + n * 10 + i;
  const actual = anterior + 5 + (i % 8);
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - (29 - i));
  return {
    id: `mock-lectura-${i}`,
    medidorIot: `IOT-${String(n).padStart(5, '0')}`,
    lecturaAnterior: anterior,
    lecturaActual: actual,
    consumoM3: actual - anterior,
    fechaHoraLectura: fecha.toISOString(),
    radiobase: `RB-${String((i % 8) + 1).padStart(3, '0')}`,
    estado: ['NORMAL', 'NORMAL', 'SIN_SENAL', 'ERROR', 'DUPLICADA'][i % 5],
  };
});

export const mockPreavisos: Preaviso[] = Array.from({ length: 15 }, (_, i) => {
  const n = i + 1;
  const consumo = 12 + (i % 20);
  return {
    id: `mock-preaviso-${n}`,
    contrato: `CTR-${String(n).padStart(5, '0')}`,
    titular: `Titular Demo ${n}`,
    periodo: `2026-${String((i % 6) + 1).padStart(2, '0')}`,
    consumoM3: consumo,
    montoBs: Math.round(consumo * 4.85 * 100) / 100,
    estado: (['PENDIENTE', 'ENVIADO', 'PAGADO', 'VENCIDO'] as const)[i % 4],
    numeroMedidor: `IOT-${String(n).padStart(5, '0')}`,
    categoria: ['Doméstico', 'Comercial', 'Industrial'][i % 3],
    detalleTarifario: `Fijo 12m³: Bs 15.00 | Base: Bs 4.85/m³ | Total período: Bs ${(Math.round(consumo * 4.85 * 100) / 100).toFixed(2)}`,
    historialConsumo: [
      { mes: 'Ene', consumo: consumo - 3 },
      { mes: 'Feb', consumo: consumo - 1 },
      { mes: 'Mar', consumo: consumo + 2 },
      { mes: 'Abr', consumo: consumo },
      { mes: 'May', consumo: consumo + 1 },
      { mes: 'Jun', consumo: consumo + 3 },
    ],
  };
});

export const mockDashboardData: DashboardData = {
  kpis: {
    consumoTotalDiario: 1842.5,
    consumoPerCapita: 0.18,
    medidoresActivos: 18,
    sensoresConFallas: 5,
    contratosActivos: 17,
    alertasActivas: 8,
  },
  consumoDiario: Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      fecha: d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short' }),
      consumo: 1200 + Math.round(Math.random() * 800),
    };
  }),
  consumoPorDistrito: [
    { distrito: 'Centro', consumo: 4200 },
    { distrito: 'Norte', consumo: 3800 },
    { distrito: 'Sur', consumo: 3100 },
    { distrito: 'Este', consumo: 2900 },
    { distrito: 'Oeste', consumo: 2600 },
  ],
  medidoresPorEstado: [
    { estado: 'ACTIVO', cantidad: 18 },
    { estado: 'SIN_SEÑAL', cantidad: 3 },
    { estado: 'ERROR', cantidad: 2 },
    { estado: 'MANTENIMIENTO', cantidad: 1 },
  ],
  consumoMensual: [
    { mes: 'Ene', consumo: 42000 },
    { mes: 'Feb', consumo: 38500 },
    { mes: 'Mar', consumo: 45200 },
    { mes: 'Abr', consumo: 41800 },
    { mes: 'May', consumo: 47600 },
    { mes: 'Jun', consumo: 44100 },
  ],
  topZonas: [
    { zona: 'Zona 1 - Centro', consumo: 5200 },
    { zona: 'Zona 3 - Norte', consumo: 4800 },
    { zona: 'Zona 2 - Sur', consumo: 4500 },
    { zona: 'Zona 4 - Este', consumo: 4200 },
    { zona: 'Zona 5 - Oeste', consumo: 3900 },
    { zona: 'Zona 6 - Cala Cala', consumo: 3600 },
    { zona: 'Zona 7 - Tiquipaya', consumo: 3400 },
    { zona: 'Zona 8 - Sacaba', consumo: 3200 },
    { zona: 'Zona 9 - Colcapirhua', consumo: 3000 },
    { zona: 'Zona 10 - Quillacollo', consumo: 2800 },
  ],
};

export function mapMedidorBadge(estado: string): 'ACTIVO' | 'SIN_SEÑAL' | 'ERROR' | 'MANTENIMIENTO' {
  const upper = estado.toUpperCase();
  if (upper.includes('MANTEN')) return 'MANTENIMIENTO';
  if (upper.includes('ERROR')) return 'ERROR';
  if (upper.includes('SENAL') || upper.includes('SEÑAL')) return 'SIN_SEÑAL';
  return 'ACTIVO';
}

export function enrichContratos(contratos: Contrato[]): Contrato[] {
  return contratos.map((c, i) => ({
    ...c,
    distrito: c.distrito ?? ['Centro', 'Norte', 'Sur', 'Este', 'Oeste'][i % 5],
    zona: c.zona ?? `Zona ${(i % 4) + 1}`,
  }));
}

export function enrichMedidores(medidores: Medidor[], lecturas: Lectura[]): Medidor[] {
  const lastByMedidor = new Map<string, Lectura>();
  lecturas.forEach((l) => {
    const prev = lastByMedidor.get(l.medidorIot);
    if (!prev || new Date(l.fechaHoraLectura) > new Date(prev.fechaHoraLectura)) {
      lastByMedidor.set(l.medidorIot, l);
    }
  });

  return medidores.map((m, i) => {
    const last = lastByMedidor.get(m.medidorIot);
    return {
      ...m,
      modelo: m.modelo ?? ['Sensus iPERL', 'Kamstrup flowIQ', 'Diehl Metering'][i % 3],
      ultimaLectura: last?.lecturaActual ?? m.ultimaLectura ?? 0,
      radiobase: last?.radiobase ?? m.radiobase ?? `RB-${String((i % 8) + 1).padStart(3, '0')}`,
      nivelSenal: last?.rssi ?? m.nivelSenal ?? -70,
    };
  });
}
