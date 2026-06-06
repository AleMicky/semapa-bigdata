import type { HomeKpis, Lectura, MedidorPendiente, PerfilLector } from '../../types';

export const mockMedidoresPendientes: MedidorPendiente[] = Array.from({ length: 8 }, (_, i) => {
  const n = i + 1;
  return {
    id: `mock-${n}`,
    medidorIot: `IOT-${String(n).padStart(5, '0')}`,
    direccion: `Calle Los Pinos ${n * 10}`,
    zona: `Zona ${(i % 4) + 1}`,
    contrato: `CTR-${String(n).padStart(5, '0')}`,
    ultimaLectura: 120 + n * 8,
    estado: i % 5 === 0 ? 'SIN_SEÑAL' : 'PENDIENTE',
  };
});

export const mockLecturas: Lectura[] = Array.from({ length: 15 }, (_, i) => {
  const n = (i % 8) + 1;
  const ant = 100 + n * 10;
  const act = ant + 5;
  const fecha = new Date();
  fecha.setHours(fecha.getHours() - i * 2);
  return {
    id: `lect-${i}`,
    medidorIot: `IOT-${String(n).padStart(5, '0')}`,
    lecturaAnterior: ant,
    lecturaActual: act,
    consumoM3: act - ant,
    fechaHoraLectura: fecha.toISOString(),
    estado: 'NORMAL',
  };
});

export const mockHomeKpis: HomeKpis = {
  lecturasPendientes: 8,
  lecturasHoy: 5,
  medidoresSinSenal: 2,
  erroresReportados: 1,
};

export const mockPerfil: PerfilLector = {
  nombre: 'Juan Pérez López',
  usuario: 'lector',
  zonaAsignada: 'Zona 1 — Centro',
  lecturasDelDia: 5,
};
