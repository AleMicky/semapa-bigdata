export type ConsultaTipo = 'ci' | 'contrato' | 'medidor';

export interface HistorialConsumoItem {
  periodo: string;
  consumoM3: number;
  montoBs: number;
}

export interface TotemConsultaResult {
  titular: string;
  ci: string;
  contrato: string;
  medidor: string;
  categoria: string;
  direccion: string;
  zona: string;
  distrito: string;
  periodo: string;
  consumoM3: number;
  montoBs: number;
  deudaBs: number;
  estadoContrato: string;
  ultimaFechaPago: string;
  qrValidacion: string;
  historialConsumo: HistorialConsumoItem[];
}

export interface ConsultaSession {
  tipo: ConsultaTipo;
  valor: string;
  result: TotemConsultaResult;
  fromMock?: boolean;
}

export const CONSULTA_STORAGE_KEY = 'totem-consulta-session';

export const CONSULTA_LABELS: Record<ConsultaTipo, string> = {
  ci: 'Consultar por CI',
  contrato: 'Consultar por Contrato',
  medidor: 'Consultar por Medidor',
};

export const CONSULTA_PLACEHOLDERS: Record<ConsultaTipo, string> = {
  ci: 'Ingrese su número de CI',
  contrato: 'Ingrese su número de contrato',
  medidor: 'Ingrese su número de medidor',
};

export function isConsultaTipo(value: string | null): value is ConsultaTipo {
  return value === 'ci' || value === 'contrato' || value === 'medidor';
}
