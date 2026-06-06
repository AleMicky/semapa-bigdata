import axios from 'axios';
import { getAuthToken } from '@/lib/auth';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function safeRequest<T>(
  request: () => Promise<T>,
  fallback: T,
): Promise<{ data: T; fromMock: boolean }> {
  try {
    const data = await request();
    return { data, fromMock: false };
  } catch {
    return { data: fallback, fromMock: true };
  }
}
