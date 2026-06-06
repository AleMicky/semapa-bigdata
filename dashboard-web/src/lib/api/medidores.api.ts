import type { Medidor } from '@/types';
import { apiClient, safeRequest } from './client';
import { enrichMedidores, mockMedidores } from '@/lib/mock/data';
import { fetchLecturas } from './lecturas.api';

export async function fetchMedidores(): Promise<{ data: Medidor[]; fromMock: boolean }> {
  return safeRequest(async () => {
    const [{ data: medidores }, { data: lecturas }] = await Promise.all([
      apiClient.get<Medidor[]>('/catalogos/medidores'),
      fetchLecturas(),
    ]);
    return enrichMedidores(medidores, lecturas);
  }, enrichMedidores(mockMedidores, []));
}
