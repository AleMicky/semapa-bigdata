'use client';

import type { ConsumoMensualItem } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function ConsumptionMonthlyChart({ data }: { data: ConsumoMensualItem[] }) {
  return (
    <Card title="Evolución mensual del consumo" subtitle="m³ acumulados">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${Number(v).toLocaleString('es-BO')} m³`, 'Consumo']} />
          <Area type="monotone" dataKey="consumo" stroke="#0c4a8a" fill="#bae6fd" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
