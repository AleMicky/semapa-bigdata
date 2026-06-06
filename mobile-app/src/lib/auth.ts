import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'semapa_mobile_token';
const USER_KEY = 'semapa_mobile_user';

export const MOCK_CREDENTIALS = {
  usuario: 'lector',
  contrasena: 'semapa123',
};

export async function saveMockAuth(usuario: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, 'mock-jwt-semapa-mobile');
  await AsyncStorage.setItem(USER_KEY, usuario);
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getAuthUser(): Promise<string | null> {
  return AsyncStorage.getItem(USER_KEY);
}

export async function clearAuth(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return Boolean(token);
}
