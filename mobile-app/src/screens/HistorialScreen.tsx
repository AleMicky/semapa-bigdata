import { fetchLecturas } from '../lib/api/lecturas.api';
import { colors } from '../theme/colors';
import type { Lectura } from '../types';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function HistorialScreen() {
  const [data, setData] = useState<Lectura[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const items = await fetchLecturas();
    setData(items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />
      }
      ListHeaderComponent={<Text style={styles.header}>Historial de lecturas</Text>}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.rowMain}>
            <Text style={styles.medidor}>{item.medidorIot}</Text>
            <Text style={styles.fecha}>
              {new Date(item.fechaHoraLectura).toLocaleString('es-BO')}
            </Text>
          </View>
          <View style={styles.rowEnd}>
            <Text style={styles.consumo}>{item.consumoM3} m³</Text>
            <View style={[styles.badge, item.estado !== 'NORMAL' && styles.badgeError]}>
              <Text style={styles.badgeText}>{item.estado}</Text>
            </View>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  header: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: colors.text },
  row: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowMain: { flex: 1 },
  medidor: { fontWeight: 'bold', color: colors.primary, fontFamily: 'monospace' },
  fecha: { fontSize: 12, color: colors.grayDark, marginTop: 2 },
  rowEnd: { alignItems: 'flex-end' },
  consumo: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  badge: { backgroundColor: '#d1fae5', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4 },
  badgeError: { backgroundColor: '#fee2e2' },
  badgeText: { fontSize: 10, fontWeight: '600' },
});
