import type { Contrato } from '@/types';
import { apiClient, safeRequest } from './client';
import { enrichContratos, mockContratos } from '@/lib/mock/data';

export async function fetchContratos(): Promise<{ data: Contrato[]; fromMock: boolean }> {
  return safeRequest(async () => {
    const { data } = await apiClient.get<Contrato[]>('/catalogos/contratos');
    return enrichContratos(data);
  }, enrichContratos(mockContratos));
}

export async function fetchContratoById(id: string): Promise<Contrato | null> {
  const { data } = await fetchContratos();
  return data.find((c) => c.id === id || c.numeroContrato === id) ?? null;
}
