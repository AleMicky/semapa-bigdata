import { isAuthenticated } from '../lib/auth';
import { HistorialScreen } from '../screens/HistorialScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { MedidoresPendientesScreen } from '../screens/MedidoresPendientesScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { RegistroLecturaScreen } from '../screens/RegistroLecturaScreen';
import { colors } from '../theme/colors';
import type { MedidorPendiente } from '../types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label }: { label: string }) {
  return <Text style={{ fontSize: 18 }}>{label}</Text>;
}

function MedidoresStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MedidoresList"
        options={{ title: 'Medidores pendientes' }}
      >
        {({ navigation }) => (
          <MedidoresPendientesScreen
            onSelectMedidor={(m: MedidorPendiente) =>
              navigation.navigate('RegistroLectura', { medidor: m })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="RegistroLectura"
        options={{ title: 'Nueva lectura' }}
      >
        {({ navigation, route }) => (
          <RegistroLecturaScreen
            medidor={(route.params as { medidor?: MedidorPendiente })?.medidor}
            onSuccess={() => navigation.goBack()}
            onCancel={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function MainTabs({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grayDark,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Inicio', tabBarIcon: () => <TabIcon label="🏠" /> }}
      />
      <Tab.Screen
        name="Medidores"
        component={MedidoresStack}
        options={{ headerShown: false, tabBarIcon: () => <TabIcon label="📡" /> }}
      />
      <Tab.Screen
        name="Historial"
        component={HistorialScreen}
        options={{ title: 'Historial', tabBarIcon: () => <TabIcon label="📋" /> }}
      />
      <Tab.Screen
        name="Perfil"
        options={{ title: 'Perfil', tabBarIcon: () => <TabIcon label="👤" /> }}
      >
        {() => <PerfilScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  const checkAuth = useCallback(async () => {
    setAuthed(await isAuthenticated());
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  if (authed === null) return null;

  return (
    <NavigationContainer>
      {authed ? (
        <MainTabs onLogout={() => setAuthed(false)} />
      ) : (
        <LoginScreen onLogin={() => setAuthed(true)} />
      )}
    </NavigationContainer>
  );
}
