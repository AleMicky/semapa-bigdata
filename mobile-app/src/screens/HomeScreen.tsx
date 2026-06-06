import { fetchLecturas } from '../lib/api/lecturas.api';
import { fetchMedidoresPendientes } from '../lib/api/medidores.api';
import { mockHomeKpis } from '../lib/mock/data';
import { colors } from '../theme/colors';
import type { HomeKpis } from '../types';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

function KpiCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.kpiCard, { borderLeftColor: color }]}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

export function HomeScreen() {
  const [kpis, setKpis] = useState<HomeKpis>(mockHomeKpis);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [medidores, lecturas] = await Promise.all([
      fetchMedidoresPendientes(),
      fetchLecturas(),
    ]);
    const today = new Date().toDateString();
    const lecturasHoy = lecturas.filter(
      (l) => new Date(l.fechaHoraLectura).toDateString() === today,
    ).length;
    setKpis({
      lecturasPendientes: medidores.length,
      lecturasHoy,
      medidoresSinSenal: medidores.filter((m) => m.estado === 'SIN_SEÑAL').length,
      erroresReportados: lecturas.filter((l) => l.estado === 'ERROR').length,
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Panel del lector</Text>
      <Text style={styles.subtitle}>Resumen operativo del día</Text>
      <View style={styles.grid}>
        <KpiCard label="Lecturas pendientes" value={kpis.lecturasPendientes} color={colors.sky} />
        <KpiCard label="Registradas hoy" value={kpis.lecturasHoy} color={colors.green} />
        <KpiCard label="Sin señal" value={kpis.medidoresSinSenal} color={colors.warning} />
        <KpiCard label="Errores" value={kpis.erroresReportados} color={colors.error} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 14, color: colors.grayDark, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpiCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    width: '47%',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  kpiValue: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  kpiLabel: { fontSize: 12, color: colors.grayDark, marginTop: 4 },
});
