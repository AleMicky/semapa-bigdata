export interface DashboardFilters {
  distrito?: string;
  zona?: string;
  contrato?: string;
  medidor?: string;
  periodo?: string;
}

export interface MapaPuntoConsumo {
  id: string;
  latitud: number;
  longitud: number;
  titular: string;
  ci?: string;
  contrato: string;
  medidor: string;
  distrito: string;
  zona: string;
  direccion?: string;
  categoria?: string;
  consumoM3: number;
  montoBs: number;
  estado: 'NORMAL' | 'ALTO' | 'SOBRECONSUMO' | 'SIN_SENAL';
  ultimaLectura?: string;
  tipo?: 'CONTRATO' | 'MEDIDOR' | 'RADIOBASE' | 'ZONA_CRITICA';
}

export interface DashboardResumen {
  consumoTotalM3: number;
  consumoPromedioM3: number;
  contratosActivos: number;
  medidoresActivos: number;
  medidoresSinSenal: number;
  alertasSobreconsumo: number;
}

export interface DistritoZona {
  distrito: string;
  zonas: string[];
}

export interface ConsumoDistritoItem {
  distrito: string;
  consumo: number;
}

export interface ConsumoZonaItem {
  zona: string;
  consumo: number;
}

export interface TopContratoItem {
  contrato: string;
  titular: string;
  consumo: number;
}

export interface MedidorEstadoItem {
  estado: string;
  cantidad: number;
}

export interface ConsumoMensualItem {
  mes: string;
  consumo: number;
}
