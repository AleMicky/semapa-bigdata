import type { Preaviso } from '@/types';
import { safeRequest } from './client';
import { mockPreavisos } from '@/lib/mock/data';
import { fetchContratos } from './contratos.api';
import { fetchLecturas } from './lecturas.api';

async function buildPreavisosFromApi(): Promise<Preaviso[]> {
  const [{ data: contratos }, { data: lecturas }] = await Promise.all([
    fetchContratos(),
    fetchLecturas(),
  ]);

  return contratos.slice(0, 15).map((c, i) => {
    const lecturasContrato = lecturas.filter((l) => l.medidorIot === c.medidorIot);
    const consumo = lecturasContrato.reduce((s, l) => s + l.consumoM3, 0) || 12 + i;
    const montoBs = Math.round(consumo * 4.85 * 100) / 100;
    return {
      id: c.id,
      contrato: c.numeroContrato,
      titular: c.titularContrato,
      periodo: '2026-06',
      consumoM3: consumo,
      montoBs,
      estado: (['PENDIENTE', 'ENVIADO', 'PAGADO', 'VENCIDO'] as const)[i % 4],
      numeroMedidor: c.medidorIot,
      categoria: c.categoria,
      detalleTarifario: `Fijo 12m³: Bs 15.00 | Base: Bs 4.85/m³ | Total: Bs ${montoBs.toFixed(2)}`,
      historialConsumo: mockPreavisos[i % mockPreavisos.length].historialConsumo,
    };
  });
}

export async function fetchPreavisos(): Promise<{ data: Preaviso[]; fromMock: boolean }> {
  return safeRequest(buildPreavisosFromApi, mockPreavisos);
}

export async function fetchPreavisoById(id: string): Promise<Preaviso | null> {
  const { data } = await fetchPreavisos();
  return data.find((p) => p.id === id || p.contrato === id) ?? null;
}
