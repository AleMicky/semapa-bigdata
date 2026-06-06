import { clearAuth, getAuthUser } from '../lib/auth';
import { mockPerfil } from '../lib/mock/data';
import { colors } from '../theme/colors';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function PerfilScreen({ onLogout }: { onLogout: () => void }) {
  const [usuario, setUsuario] = useState(mockPerfil.usuario);

  useEffect(() => {
    getAuthUser().then((u) => { if (u) setUsuario(u); });
  }, []);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Desea salir de la aplicación?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await clearAuth();
          onLogout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{mockPerfil.nombre.charAt(0)}</Text>
      </View>
      <Text style={styles.nombre}>{mockPerfil.nombre}</Text>
      <Text style={styles.rol}>Lector de campo — SEMAPA</Text>

      <View style={styles.card}>
        <Row label="Usuario" value={usuario} />
        <Row label="Zona asignada" value={mockPerfil.zonaAsignada} />
        <Row label="Lecturas del día" value={String(mockPerfil.lecturasDelDia)} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray, alignItems: 'center', padding: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: colors.white },
  nombre: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginTop: 12 },
  rol: { fontSize: 14, color: colors.grayDark, marginBottom: 24 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontSize: 14, color: colors.grayDark },
  rowValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  logoutBtn: {
    marginTop: 32,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  logoutText: { color: colors.error, fontWeight: '600', fontSize: 15 },
});
