const TOKEN_KEY = 'semapa_auth_token';
const USER_KEY = 'semapa_auth_user';

export const MOCK_CREDENTIALS = {
  usuario: 'admin',
  contrasena: 'semapa123',
};

export function saveMockAuth(usuario: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, 'mock-jwt-semapa-demo-token');
  localStorage.setItem(USER_KEY, usuario);
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_KEY);
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}
