import type { DashboardData } from '@/types';
import { safeRequest } from './client';
import { fetchContratos } from './contratos.api';
import { fetchLecturas } from './lecturas.api';
import { fetchMedidores } from './medidores.api';
import { mockDashboardData } from '@/lib/mock/data';

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

  const medidoresActivos = medidores.filter((m) =>
    m.estado.toUpperCase().includes('INSTALADO') || m.estado.toUpperCase() === 'ACTIVO',
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
