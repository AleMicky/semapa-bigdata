'use client';

import type { TopContratoItem } from '@/types/dashboard';
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

export function TopContractsChart({ data }: { data: TopContratoItem[] }) {
  return (
    <Card title="Top 10 contratos con mayor consumo" subtitle="m³ del periodo">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            dataKey="contrato"
            type="category"
            width={80}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            formatter={(v) => [`${v} m³`, 'Consumo']}
            labelFormatter={(_, payload) => {
              const item = payload?.[0]?.payload as TopContratoItem | undefined;
              return item ? `${item.contrato} — ${item.titular}` : '';
            }}
          />
          <Bar dataKey="consumo" fill="#10b981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
