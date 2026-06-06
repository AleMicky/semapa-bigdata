export interface Contrato {
  id: string;
  numeroContrato: string;
  titularContrato: string;
  ciTitular?: string;
  categoria: string;
  subcategoria?: string;
  estadoContrato: string;
  medidorIot?: string;
  numeroCatastro?: string;
  distrito?: string;
  zona?: string;
  active?: boolean;
}

export interface Medidor {
  id: string;
  medidorIot: string;
  tipoMedidorId?: string;
  fechaInstalacion?: string;
  estado: string;
  modelo?: string;
  ultimaLectura?: number;
  radiobase?: string;
  nivelSenal?: number;
  active?: boolean;
}

export interface Lectura {
  id: string;
  medidorIot: string;
  contratoId?: string;
  lecturaAnterior: number;
  lecturaActual: number;
  consumoM3: number;
  fechaHoraLectura: string;
  radiobase?: string;
  rssi?: number;
  estado: string;
  active?: boolean;
}

export interface Preaviso {
  id: string;
  contrato: string;
  titular: string;
  periodo: string;
  consumoM3: number;
  montoBs: number;
  estado: 'PENDIENTE' | 'ENVIADO' | 'PAGADO' | 'VENCIDO';
  numeroMedidor?: string;
  categoria?: string;
  detalleTarifario?: string;
  historialConsumo?: { mes: string; consumo: number }[];
}

export interface DashboardKpis {
  consumoTotalDiario: number;
  consumoPerCapita: number;
  medidoresActivos: number;
  sensoresConFallas: number;
  contratosActivos: number;
  alertasActivas: number;
}

export interface ConsumoDiario {
  fecha: string;
  consumo: number;
}

export interface ConsumoDistrito {
  distrito: string;
  consumo: number;
}

export interface MedidorEstado {
  estado: string;
  cantidad: number;
}

export interface ConsumoMensual {
  mes: string;
  consumo: number;
}

export interface TopZona {
  zona: string;
  consumo: number;
}

export interface DashboardData {
  kpis: DashboardKpis;
  consumoDiario: ConsumoDiario[];
  consumoPorDistrito: ConsumoDistrito[];
  medidoresPorEstado: MedidorEstado[];
  consumoMensual: ConsumoMensual[];
  topZonas: TopZona[];
}

export type MedidorBadgeEstado = 'ACTIVO' | 'SIN_SEÑAL' | 'ERROR' | 'MANTENIMIENTO';
