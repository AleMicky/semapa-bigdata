export interface MedidorPendiente {
  id: string;
  medidorIot: string;
  direccion: string;
  zona: string;
  contrato: string;
  ultimaLectura: number;
  estado: string;
}

export interface Lectura {
  id: string;
  medidorIot: string;
  lecturaAnterior: number;
  lecturaActual: number;
  consumoM3: number;
  fechaHoraLectura: string;
  estado: string;
}

export interface CreateLecturaPayload {
  medidorIot: string;
  lecturaAnterior: number;
  lecturaActual: number;
  fechaHoraLectura: string;
  radiobase: string;
  estado: string;
}

export interface HomeKpis {
  lecturasPendientes: number;
  lecturasHoy: number;
  medidoresSinSenal: number;
  erroresReportados: number;
}

export interface PerfilLector {
  nombre: string;
  usuario: string;
  zonaAsignada: string;
  lecturasDelDia: number;
}
