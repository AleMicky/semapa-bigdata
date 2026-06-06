import type { CreateLecturaPayload, Lectura } from '../../types';
import { apiClient, safeRequest } from './client';
import { mockLecturas } from '../mock/data';

export async function fetchLecturas(): Promise<Lectura[]> {
  return safeRequest(async () => {
    const { data } = await apiClient.get<Lectura[]>('/lecturas');
    return data.sort(
      (a, b) => new Date(b.fechaHoraLectura).getTime() - new Date(a.fechaHoraLectura).getTime(),
    );
  }, mockLecturas);
}

export async function createLectura(payload: CreateLecturaPayload): Promise<Lectura> {
  const { data } = await apiClient.post<Lectura>('/lecturas', payload);
  return data;
}
