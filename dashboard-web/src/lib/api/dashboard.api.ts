import type { Contrato, DashboardData, Medidor } from '@/types';
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
import {
  DISTRITOS_COCHABAMBA,
  filterPuntosMapa,
  filterResumen,
  getConsumoPorZonaMock,
  mockConsumoMensual,
  mockConsumoPorDistrito,
  mockMedidoresPorEstado,
  mockPuntosMapa,
  mockTopContratos,
  mockZonasCriticas,
} from '@/mocks/dashboard.mock';
import { mockDashboardData } from '@/lib/mock/data';
import { safeRequest, apiClient } from './client';
import { fetchContratos } from './contratos.api';
import { fetchLecturas } from './lecturas.api';
import { fetchMedidores } from './medidores.api';

function buildQueryParams(filters: DashboardFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.distrito) params.distrito = filters.distrito;
  if (filters.zona) params.zona = filters.zona;
  if (filters.contrato) params.contrato = filters.contrato;
  if (filters.medidor) params.medidor = filters.medidor;
  if (filters.periodo) params.periodo = filters.periodo;
  return params;
}

async function buildDashboardFromApi(): Promise<DashboardData> {
  const [{ data: lecturas }, { data: contratos }, { data: medidores }] = await Promise.all([
    fetchLecturas(),
    fetchContratos(),
    fetchMedidores(),
  ]);

  const consumoTotalDiario = lecturas
    .filter((l) => {
      const d = new Date(l.fechaHoraLectura);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    })
    .reduce((sum, l) => sum + l.consumoM3, 0);

  const medidoresActivos = medidores.filter(
    (m) => m.estado.toUpperCase().includes('INSTALADO') || m.estado.toUpperCase() === 'ACTIVO',
  ).length;

  const sensoresConFallas = lecturas.filter((l) =>
    ['ERROR', 'SIN_SENAL'].includes(l.estado),
  ).length;

  const contratosActivos = contratos.filter((c) => c.estadoContrato === 'ACTIVO').length;

  const consumoDiarioMap = new Map<string, number>();
  lecturas.forEach((l) => {
    const key = new Date(l.fechaHoraLectura).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'short',
    });
    consumoDiarioMap.set(key, (consumoDiarioMap.get(key) ?? 0) + l.consumoM3);
  });

  const consumoDiario = Array.from(consumoDiarioMap.entries())
    .slice(-14)
    .map(([fecha, consumo]) => ({ fecha, consumo }));

  const estadoCount = new Map<string, number>();
  medidores.forEach((m) => {
    const estado =
      m.estado.toUpperCase().includes('MANTEN') ? 'MANTENIMIENTO'
      : m.estado.toUpperCase().includes('ERROR') ? 'ERROR'
      : m.estado.toUpperCase().includes('SENAL') || m.estado.toUpperCase().includes('SEÑAL') ? 'SIN_SEÑAL'
      : 'ACTIVO';
    estadoCount.set(estado, (estadoCount.get(estado) ?? 0) + 1);
  });

  return {
    kpis: {
      consumoTotalDiario: consumoTotalDiario || mockDashboardData.kpis.consumoTotalDiario,
      consumoPerCapita: mockDashboardData.kpis.consumoPerCapita,
      medidoresActivos: medidoresActivos || mockDashboardData.kpis.medidoresActivos,
      sensoresConFallas: sensoresConFallas || mockDashboardData.kpis.sensoresConFallas,
      contratosActivos: contratosActivos || mockDashboardData.kpis.contratosActivos,
      alertasActivas: mockDashboardData.kpis.alertasActivas,
    },
    consumoDiario: consumoDiario.length ? consumoDiario : mockDashboardData.consumoDiario,
    consumoPorDistrito: mockDashboardData.consumoPorDistrito,
    medidoresPorEstado: estadoCount.size
      ? Array.from(estadoCount.entries()).map(([estado, cantidad]) => ({ estado, cantidad }))
      : mockDashboardData.medidoresPorEstado,
    consumoMensual: mockDashboardData.consumoMensual,
    topZonas: mockDashboardData.topZonas,
  };
}

export async function fetchDashboardData(): Promise<{ data: DashboardData; fromMock: boolean }> {
  return safeRequest(buildDashboardFromApi, mockDashboardData);
}

function buildMapaFromCatalogos(
  contratos: Contrato[],
  medidores: Medidor[],
): MapaPuntoConsumo[] {
  const medidorMap = new Map(medidores.map((m) => [m.medidorIot, m]));

  return contratos.map((c, i) => {
    const med = c.medidorIot ? medidorMap.get(c.medidorIot) : undefined;
    const estadoRaw = med?.estado?.toUpperCase() ?? 'NORMAL';
    const estado: MapaPuntoConsumo['estado'] =
      estadoRaw.includes('SENAL') || estadoRaw.includes('SEÑAL') ? 'SIN_SENAL'
      : estadoRaw.includes('ERROR') ? 'SOBRECONSUMO'
      : 'NORMAL';
    const [lat, lng] = [
      -17.35 - (i % 10) * 0.01,
      -66.1 - (i % 15) * 0.01,
    ];
    const consumoM3 = 10 + (i % 25);
    return {
      id: c.id,
      latitud: lat,
      longitud: lng,
      titular: c.titularContrato,
      ci: c.ciTitular,
      contrato: c.numeroContrato,
      medidor: c.medidorIot ?? `IOT-${i}`,
      distrito: c.distrito ?? 'Centro',
      zona: c.zona ?? 'Zona 1',
      categoria: c.categoria,
      consumoM3,
      montoBs: Math.round(consumoM3 * 4.85 * 100) / 100,
      estado,
      ultimaLectura: med?.fechaInstalacion,
      tipo: 'CONTRATO' as const,
    };
  });
}

export async function getMapaConsumo(
  filters: DashboardFilters = {},
): Promise<{ data: MapaPuntoConsumo[]; fromMock: boolean }> {
  return safeRequest(async () => {
    const { data } = await apiClient.get<MapaPuntoConsumo[]>('/dashboard/mapa', {
      params: buildQueryParams(filters),
    });
    return data;
  }, [...filterPuntosMapa([...mockPuntosMapa, ...mockZonasCriticas], filters)]);
}

export async function getDashboardResumen(
  filters: DashboardFilters = {},
): Promise<{ data: DashboardResumen; fromMock: boolean }> {
  return safeRequest(async () => {
    const { data } = await apiClient.get<DashboardResumen>('/dashboard/resumen', {
      params: buildQueryParams(filters),
    });
    return data;
  }, filterResumen(filters));
}

export async function getConsumoPorDistrito(
  periodo?: string,
): Promise<{ data: ConsumoDistritoItem[]; fromMock: boolean }> {
  return safeRequest(async () => {
    const { data } = await apiClient.get<ConsumoDistritoItem[]>('/dashboard/consumo-distritos', {
      params: periodo ? { periodo } : {},
    });
    return data;
  }, mockConsumoPorDistrito);
}

export async function getConsumoPorZona(
  distrito?: string,
  periodo?: string,
): Promise<{ data: ConsumoZonaItem[]; fromMock: boolean }> {
  return safeRequest(async () => {
    const params: Record<string, string> = {};
    if (distrito) params.distrito = distrito;
    if (periodo) params.periodo = periodo;
    const { data } = await apiClient.get<ConsumoZonaItem[]>('/dashboard/consumo-zonas', { params });
    return data;
  }, getConsumoPorZonaMock(distrito));
}

export async function getTopContratos(
  periodo?: string,
): Promise<{ data: TopContratoItem[]; fromMock: boolean }> {
  return safeRequest(async () => {
    const { data } = await apiClient.get<TopContratoItem[]>('/dashboard/top-contratos', {
      params: periodo ? { periodo } : {},
    });
    return data;
  }, mockTopContratos);
}

export async function getMedidoresPorEstadoMapa(): Promise<{
  data: MedidorEstadoItem[];
  fromMock: boolean;
}> {
  return safeRequest(async () => {
    const { data: medidores } = await fetchMedidores();
    const counts = new Map<string, number>();
    medidores.forEach((m) => {
      const e = m.estado.toUpperCase();
      const key =
        e.includes('SENAL') || e.includes('SEÑAL') ? 'SIN_SEÑAL'
        : e.includes('ERROR') ? 'SOBRECONSUMO'
        : e.includes('MANTEN') ? 'ALTO'
        : 'NORMAL';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([estado, cantidad]) => ({ estado, cantidad }));
  }, mockMedidoresPorEstado);
}

export async function getConsumoMensualMapa(): Promise<{
  data: ConsumoMensualItem[];
  fromMock: boolean;
}> {
  return safeRequest(async () => {
    const { data } = await apiClient.get<ConsumoMensualItem[]>('/dashboard/consumo-mensual');
    return data;
  }, mockConsumoMensual);
}

export async function getDistritosZonas(): Promise<{ data: DistritoZona[]; fromMock: boolean }> {
  return safeRequest(async () => {
    const { data } = await apiClient.get<DistritoZona[]>('/catalogos/distritos-zonas');
    return data;
  }, DISTRITOS_COCHABAMBA);
}

export async function getContratos(): Promise<{ data: Contrato[]; fromMock: boolean }> {
  return fetchContratos();
}

export async function getMedidores(): Promise<{ data: Medidor[]; fromMock: boolean }> {
  return fetchMedidores();
}

export async function buildMapaFromApis(
  filters: DashboardFilters = {},
): Promise<{ data: MapaPuntoConsumo[]; fromMock: boolean }> {
  try {
    const [{ data: contratos }, { data: medidores }] = await Promise.all([
      fetchContratos(),
      fetchMedidores(),
    ]);
    const puntos = buildMapaFromCatalogos(contratos, medidores);
    return { data: filterPuntosMapa(puntos, filters), fromMock: false };
  } catch {
    return getMapaConsumo(filters);
  }
}
