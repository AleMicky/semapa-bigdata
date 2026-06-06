import { fetchMedidoresPendientes } from '../lib/api/medidores.api';
import { colors } from '../theme/colors';
import type { MedidorPendiente } from '../types';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export function MedidoresPendientesScreen({
  onSelectMedidor,
}: {
  onSelectMedidor: (medidor: MedidorPendiente) => void;
}) {
  const [data, setData] = useState<MedidorPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const items = await fetchMedidoresPendientes();
    setData(items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={
        <Text style={styles.header}>Medidores pendientes de lectura</Text>
      }
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => onSelectMedidor(item)}>
          <View style={styles.cardHeader}>
            <Text style={styles.medidor}>{item.medidorIot}</Text>
            <View style={[styles.badge, item.estado === 'SIN_SEÑAL' ? styles.badgeWarn : styles.badgeOk]}>
              <Text style={styles.badgeText}>{item.estado}</Text>
            </View>
          </View>
          <Text style={styles.row}>📍 {item.direccion}</Text>
          <Text style={styles.row}>Zona: {item.zona} · Contrato: {item.contrato}</Text>
          <Text style={styles.lectura}>Última lectura: {item.ultimaLectura} m³</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No hay medidores pendientes</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  header: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  medidor: { fontSize: 16, fontWeight: 'bold', color: colors.primary, fontFamily: 'monospace' },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeOk: { backgroundColor: '#dbeafe' },
  badgeWarn: { backgroundColor: '#ffedd5' },
  badgeText: { fontSize: 10, fontWeight: '600' },
  row: { fontSize: 13, color: colors.grayDark, marginTop: 2 },
  lectura: { fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 8 },
  empty: { textAlign: 'center', color: colors.grayDark, marginTop: 40 },
});
