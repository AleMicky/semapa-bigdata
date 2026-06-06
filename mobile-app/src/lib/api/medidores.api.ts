import type { MedidorPendiente } from '../../types';
import { apiClient, safeRequest } from './client';
import { mockMedidoresPendientes } from '../mock/data';

interface MedidorApi {
  id: string;
  medidorIot: string;
  estado: string;
}

interface ContratoApi {
  numeroContrato: string;
  medidorIot?: string;
  titularContrato: string;
}

export async function fetchMedidoresPendientes(): Promise<MedidorPendiente[]> {
  return safeRequest(async () => {
    const [{ data: medidores }, { data: contratos }] = await Promise.all([
      apiClient.get<MedidorApi[]>('/catalogos/medidores'),
      apiClient.get<ContratoApi[]>('/catalogos/contratos'),
    ]);
    return medidores.slice(0, 10).map((m, i) => {
      const contrato = contratos.find((c) => c.medidorIot === m.medidorIot);
      return {
        id: m.id,
        medidorIot: m.medidorIot,
        direccion: `Av. Demo ${i + 1} #${100 + i}`,
        zona: `Zona ${(i % 4) + 1}`,
        contrato: contrato?.numeroContrato ?? `CTR-${String(i + 1).padStart(5, '0')}`,
        ultimaLectura: 100 + i * 15,
        estado: m.estado.includes('MANTEN') ? 'MANTENIMIENTO' : 'PENDIENTE',
      };
    });
  }, mockMedidoresPendientes);
}
