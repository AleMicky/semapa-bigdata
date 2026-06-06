'use client';

import type { DashboardData } from '@/types';
import { Card } from '@/components/ui/Card';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#0c4a8a', '#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function DashboardCharts({ data }: { data: DashboardData }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Consumo diario de agua" subtitle="Últimos 14 días (m³)">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.consumoDiario}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="consumo" stroke="#0c4a8a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Consumo por distrito" subtitle="m³ acumulados">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.consumoPorDistrito}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="distrito" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="consumo" fill="#0284c7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Medidores por estado">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data.medidoresPorEstado}
              dataKey="cantidad"
              nameKey="estado"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={(props) => {
                const entry = props as unknown as { estado: string; cantidad: number };
                return `${entry.estado}: ${entry.cantidad}`;
              }}
            >
              {data.medidoresPorEstado.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Consumo mensual" subtitle="Tendencia (m³)">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.consumoMensual}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="consumo" stroke="#10b981" fill="#d1fae5" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Top 10 zonas con mayor consumo" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data.topZonas} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="zona" type="category" width={120} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="consumo" fill="#0c4a8a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
