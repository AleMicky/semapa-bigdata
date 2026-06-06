import type { Lectura } from '@/types';
import { apiClient, safeRequest } from './client';
import { mockLecturas } from '@/lib/mock/data';

export async function fetchLecturas(): Promise<{ data: Lectura[]; fromMock: boolean }> {
  return safeRequest(async () => {
    const { data } = await apiClient.get<Lectura[]>('/lecturas');
    return data.sort(
      (a, b) => new Date(b.fechaHoraLectura).getTime() - new Date(a.fechaHoraLectura).getTime(),
    );
  }, mockLecturas);
}

export async function simularLecturas(cantidad = 5): Promise<{ data: Lectura[]; fromMock: boolean }> {
  return safeRequest(async () => {
    const { data } = await apiClient.post<Lectura[]>('/lecturas/simular', { cantidad });
    return data;
  }, mockLecturas.slice(0, cantidad));
}

export interface CreateLecturaPayload {
  medidorIot: string;
  lecturaAnterior: number;
  lecturaActual: number;
  fechaHoraLectura: string;
  radiobase: string;
  estado: string;
  contratoId?: string;
}

export async function createLectura(payload: CreateLecturaPayload): Promise<Lectura> {
  const { data } = await apiClient.post<Lectura>('/lecturas', payload);
  return data;
}
