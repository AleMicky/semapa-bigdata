'use client';

import type { ConsumoDistritoItem } from '@/types/dashboard';
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

export function ConsumptionByDistrictChart({ data }: { data: ConsumoDistritoItem[] }) {
  return (
    <Card title="Consumo por distrito" subtitle="m³ del periodo">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="distrito"
            tick={{ fontSize: 9 }}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${v} m³`, 'Consumo']} />
          <Bar dataKey="consumo" fill="#0284c7" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
