'use client';

import type { MedidorEstadoItem } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS: Record<string, string> = {
  NORMAL: '#10b981',
  ALTO: '#f59e0b',
  SOBRECONSUMO: '#ef4444',
  'SIN_SEÑAL': '#94a3b8',
  ACTIVO: '#10b981',
  ERROR: '#ef4444',
  MANTENIMIENTO: '#f59e0b',
};

export function MeterStatusChart({ data }: { data: MedidorEstadoItem[] }) {
  return (
    <Card title="Medidores por estado">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="cantidad"
            nameKey="estado"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(props) => {
              const entry = props as unknown as MedidorEstadoItem;
              return `${entry.estado}: ${entry.cantidad}`;
            }}
          >
            {data.map((entry) => (
              <Cell key={entry.estado} fill={COLORS[entry.estado] ?? '#0c4a8a'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
