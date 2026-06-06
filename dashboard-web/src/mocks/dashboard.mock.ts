import type {
  ConsumoDistritoItem,
  ConsumoMensualItem,
  ConsumoZonaItem,
  DashboardFilters,
  DashboardResumen,
  DistritoZona,
  MapaPuntoConsumo,
  MedidorEstadoItem,
  TopContratoItem,
} from '@/types/dashboard';

/** 14 distritos / zonas urbanas de Cochabamba y área metropolitana */
export const DISTRITOS_COCHABAMBA: DistritoZona[] = [
  { distrito: 'Centro', zonas: ['Zona A - San Francisco', 'Zona B - 25 de Mayo', 'Zona C - Plaza Colón'] },
  { distrito: 'San Pedro', zonas: ['Zona A - San Pedro Norte', 'Zona B - San Pedro Sur'] },
  { distrito: 'Muyurina', zonas: ['Zona A - Muyurina Alta', 'Zona B - Muyurina Baja'] },
  { distrito: 'Cala Cala', zonas: ['Zona A - Cala Cala Centro', 'Zona B - Cala Cala Este', 'Zona C - Cala Cala Oeste'] },
  { distrito: 'Hipódromo', zonas: ['Zona A - Hipódromo Norte', 'Zona B - Hipódromo Sur'] },
  { distrito: 'América', zonas: ['Zona A - América Central', 'Zona B - América Oeste'] },
  { distrito: 'Villa Aspiazu', zonas: ['Zona A - Aspiazu Norte', 'Zona B - Aspiazu Sur'] },
  { distrito: 'Taquiña', zonas: ['Zona A - Taquiña Alta', 'Zona B - Taquiña Baja'] },
  { distrito: 'Sarcobamba', zonas: ['Zona A - Sarcobamba Este', 'Zona B - Sarcobamba Oeste'] },
  { distrito: 'Alalay', zonas: ['Zona A - Alalay Norte', 'Zona B - Alalay Sur'] },
  { distrito: 'Quillacollo', zonas: ['Zona A - Quillacollo Centro', 'Zona B - San Simón'] },
  { distrito: 'Colcapirhua', zonas: ['Zona A - Colcapirhua Industrial', 'Zona B - Colcapirhua Residencial'] },
  { distrito: 'Sacaba', zonas: ['Zona A - Sacaba Centro', 'Zona B - Sacaba Km 4'] },
  { distrito: 'Tiquipaya', zonas: ['Zona A - Tiquipaya Universitaria', 'Zona B - Tiquipaya Rural'] },
];

const ESTADOS: MapaPuntoConsumo['estado'][] = ['NORMAL', 'NORMAL', 'NORMAL', 'ALTO', 'SOBRECONSUMO', 'SIN_SENAL'];
const CATEGORIAS = ['Doméstico', 'Comercial', 'Industrial', 'Institucional'];

function randomCoord(baseLat: number, baseLng: number, spread = 0.03): [number, number] {
  const lat = baseLat + (Math.random() - 0.5) * spread;
  const lng = baseLng + (Math.random() - 0.5) * spread;
  return [Math.round(lat * 10000) / 10000, Math.round(lng * 10000) / 10000];
}

/** Centro aproximado por distrito para dispersar puntos */
const DISTRITO_CENTERS: Record<string, [number, number]> = {
  Centro: [-17.3895, -66.1568],
  'San Pedro': [-17.382, -66.148],
  Muyurina: [-17.395, -66.142],
  'Cala Cala': [-17.378, -66.168],
  Hipódromo: [-17.401, -66.155],
  América: [-17.405, -66.172],
  'Villa Aspiazu': [-17.412, -66.138],
  Taquiña: [-17.42, -66.165],
  Sarcobamba: [-17.368, -66.125],
  Alalay: [-17.358, -66.18],
  Quillacollo: [-17.392, -66.278],
  Colcapirhua: [-17.375, -66.235],
  Sacaba: [-17.398, -66.038],
  Tiquipaya: [-17.335, -66.215],
};

function generatePuntosConsumo(): MapaPuntoConsumo[] {
  const puntos: MapaPuntoConsumo[] = [];
  let idx = 0;

  DISTRITOS_COCHABAMBA.forEach((d) => {
    const [baseLat, baseLng] = DISTRITO_CENTERS[d.distrito] ?? [-17.3895, -66.1568];

    d.zonas.forEach((zona, zi) => {
      const count = 3 + (zi % 3);
      for (let i = 0; i < count; i++) {
        idx += 1;
        const [lat, lng] = randomCoord(baseLat, baseLng, 0.025);
        const estado = ESTADOS[idx % ESTADOS.length];
        const consumoM3 =
          estado === 'SOBRECONSUMO' ? 45 + (idx % 20)
          : estado === 'ALTO' ? 28 + (idx % 12)
          : estado === 'SIN_SENAL' ? 0
          : 8 + (idx % 18);
        const montoBs = Math.round(consumoM3 * 4.85 * 100) / 100;
        const n = String(idx).padStart(5, '0');

        puntos.push({
          id: `punto-${n}`,
          latitud: lat,
          longitud: lng,
          titular: `Titular ${d.distrito} ${idx}`,
          ci: `${10000000 + idx}`,
          contrato: `CTR-${n}`,
          medidor: `IOT-${n}`,
          distrito: d.distrito,
          zona,
          direccion: `Av. Demo ${idx}, ${d.distrito}`,
          categoria: CATEGORIAS[idx % CATEGORIAS.length],
          consumoM3,
          montoBs,
          estado,
          ultimaLectura: new Date(Date.now() - (idx % 72) * 3600000).toISOString(),
          tipo: 'CONTRATO',
        });
      }
    });
  });

  return puntos;
}

function generateRadiobases(): MapaPuntoConsumo[] {
  const bases = [
    { id: 'rb-001', lat: -17.387, lng: -66.154, zona: 'Centro' },
    { id: 'rb-002', lat: -17.376, lng: -66.162, zona: 'Cala Cala' },
    { id: 'rb-003', lat: -17.403, lng: -66.17, zona: 'América' },
    { id: 'rb-004', lat: -17.39, lng: -66.275, zona: 'Quillacollo' },
    { id: 'rb-005', lat: -17.396, lng: -66.04, zona: 'Sacaba' },
    { id: 'rb-006', lat: -17.337, lng: -66.21, zona: 'Tiquipaya' },
    { id: 'rb-007', lat: -17.372, lng: -66.232, zona: 'Colcapirhua' },
    { id: 'rb-008', lat: -17.418, lng: -66.16, zona: 'Taquiña' },
  ];

  return bases.map((b, i) => ({
    id: b.id,
    latitud: b.lat,
    longitud: b.lng,
    titular: `Radiobase ${b.zona}`,
    contrato: `RB-${String(i + 1).padStart(3, '0')}`,
    medidor: `RB-${String(i + 1).padStart(3, '0')}`,
    distrito: b.zona,
    zona: b.zona,
    consumoM3: 0,
    montoBs: 0,
    estado: 'NORMAL' as const,
    tipo: 'RADIOBASE' as const,
  }));
}

function generateZonasCriticas(puntos: MapaPuntoConsumo[]): MapaPuntoConsumo[] {
  const sobreconsumo = puntos.filter((p) => p.estado === 'SOBRECONSUMO').slice(0, 6);
  return sobreconsumo.map((p, i) => ({
    ...p,
    id: `critica-${i + 1}`,
    tipo: 'ZONA_CRITICA' as const,
    titular: `Zona crítica — ${p.zona}`,
  }));
}

export const mockPuntosMapa: MapaPuntoConsumo[] = [
  ...generatePuntosConsumo(),
  ...generateRadiobases(),
];

export const mockZonasCriticas = generateZonasCriticas(generatePuntosConsumo());

export const mockDashboardResumen: DashboardResumen = {
  consumoTotalM3: 128450,
  consumoPromedioM3: 18.6,
  contratosActivos: 142,
  medidoresActivos: 138,
  medidoresSinSenal: 12,
  alertasSobreconsumo: 8,
};

export const mockConsumoPorDistrito: ConsumoDistritoItem[] = DISTRITOS_COCHABAMBA.map((d, i) => ({
  distrito: d.distrito,
  consumo: 5200 + (14 - i) * 380 + (i % 3) * 120,
}));

export const mockConsumoPorZona: ConsumoZonaItem[] = DISTRITOS_COCHABAMBA.flatMap((d) =>
  d.zonas.map((zona, i) => ({
    zona,
    consumo: 800 + i * 150 + Math.floor(Math.random() * 400),
  })),
);

export const mockTopContratos: TopContratoItem[] = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  return {
    contrato: `CTR-${String(n * 7).padStart(5, '0')}`,
    titular: `Titular Top ${n}`,
    consumo: 95 - i * 6 + (i % 3) * 2,
  };
});

export const mockMedidoresPorEstado: MedidorEstadoItem[] = [
  { estado: 'NORMAL', cantidad: 98 },
  { estado: 'ALTO', cantidad: 24 },
  { estado: 'SOBRECONSUMO', cantidad: 8 },
  { estado: 'SIN_SEÑAL', cantidad: 12 },
];

export const mockConsumoMensual: ConsumoMensualItem[] = [
  { mes: 'Ene', consumo: 112000 },
  { mes: 'Feb', consumo: 108500 },
  { mes: 'Mar', consumo: 118200 },
  { mes: 'Abr', consumo: 115800 },
  { mes: 'May', consumo: 122400 },
  { mes: 'Jun', consumo: 128450 },
];

export function filterPuntosMapa(
  puntos: MapaPuntoConsumo[],
  filters: DashboardFilters,
): MapaPuntoConsumo[] {
  return puntos.filter((p) => {
    if (filters.distrito && p.distrito !== filters.distrito) return false;
    if (filters.zona && p.zona !== filters.zona) return false;
    if (filters.contrato && !p.contrato.toLowerCase().includes(filters.contrato.toLowerCase())) {
      return false;
    }
    if (filters.medidor && !p.medidor.toLowerCase().includes(filters.medidor.toLowerCase())) {
      return false;
    }
    return true;
  });
}

export function filterResumen(filters: DashboardFilters): DashboardResumen {
  const puntos = filterPuntosMapa(
    mockPuntosMapa.filter((p) => p.tipo === 'CONTRATO' || !p.tipo),
    filters,
  );
  const consumoTotal = puntos.reduce((s, p) => s + p.consumoM3, 0);
  const activos = puntos.filter((p) => p.estado !== 'SIN_SENAL').length;

  return {
    consumoTotalM3: consumoTotal || mockDashboardResumen.consumoTotalM3,
    consumoPromedioM3: puntos.length ? Math.round((consumoTotal / puntos.length) * 10) / 10 : mockDashboardResumen.consumoPromedioM3,
    contratosActivos: puntos.length || mockDashboardResumen.contratosActivos,
    medidoresActivos: activos || mockDashboardResumen.medidoresActivos,
    medidoresSinSenal: puntos.filter((p) => p.estado === 'SIN_SENAL').length,
    alertasSobreconsumo: puntos.filter((p) => p.estado === 'SOBRECONSUMO').length,
  };
}

export function getConsumoPorZonaMock(distrito?: string): ConsumoZonaItem[] {
  if (!distrito) return mockConsumoPorZona.slice(0, 12);
  const d = DISTRITOS_COCHABAMBA.find((x) => x.distrito === distrito);
  if (!d) return mockConsumoPorZona.slice(0, 6);
  return d.zonas.map((zona, i) => ({
    zona,
    consumo: 900 + i * 200 + (distrito.length % 5) * 50,
  }));
}
