import axios from 'axios';
import { getMockTotemResult } from '@/lib/mock';
import type { ConsultaTipo, TotemConsultaResult } from '@/types/totem';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export interface ConsultaResponse {
  data: TotemConsultaResult | null;
  fromMock: boolean;
  error?: string;
}

export async function consultarTotem(tipo: ConsultaTipo, valor: string): Promise<ConsultaResponse> {
  try {
    const { data } = await apiClient.get<TotemConsultaResult>('/totem/consulta', {
      params: { tipo, valor },
    });

    if (!data || !data.titular) {
      return { data: null, fromMock: false, error: 'Sin resultados' };
    }

    return { data, fromMock: false };
  } catch {
    const mock = getMockTotemResult(tipo, valor);
    return { data: mock, fromMock: true };
  }
}
