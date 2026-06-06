'use client';

import type { ConsumoZonaItem } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function ConsumptionByZoneChart({ data }: { data: ConsumoZonaItem[] }) {
  return (
    <Card title="Consumo por zona" subtitle="m³ del periodo">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis dataKey="zona" type="category" width={110} tick={{ fontSize: 9 }} />
          <Tooltip formatter={(v) => [`${v} m³`, 'Consumo']} />
          <Bar dataKey="consumo" fill="#0c4a8a" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
