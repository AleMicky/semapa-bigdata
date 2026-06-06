import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Lectura } from '../../domain/entities/lectura.entity';
import { EstadoLectura } from '../../domain/enums/estado-lectura.enum';
import { CrearLecturaUseCase } from './crear-lectura.use-case';

interface MedidorCatalogo {
  medidorIot: string;
}

@Injectable()
export class SimularLecturasUseCase {
  constructor(
    private readonly crearLecturaUseCase: CrearLecturaUseCase,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async execute(cantidad = 10): Promise<Lectura[]> {
    const catalogosUrl = this.configService.get<string>('catalogos.url');
    const response = await firstValueFrom(
      this.httpService.get<MedidorCatalogo[]>(`${catalogosUrl}/medidores`),
    );
    const medidores = response.data;

    if (!medidores.length) {
      return [];
    }

    const lecturas: Lectura[] = [];
    for (let i = 0; i < cantidad; i++) {
      const medidor = medidores[i % medidores.length];
      const lecturaAnterior = 100 + i * 5;
      const lecturaActual = lecturaAnterior + Math.floor(Math.random() * 10) + 1;

      const lectura = await this.crearLecturaUseCase.execute({
        medidorIot: medidor.medidorIot,
        lecturaAnterior,
        lecturaActual,
        fechaHoraLectura: new Date().toISOString(),
        radiobase: `RB-${String((i % 20) + 1).padStart(3, '0')}`,
        rssi: -90 + Math.random() * 20,
        snr: 5 + Math.random() * 10,
        estado: EstadoLectura.NORMAL,
      });
      lecturas.push(lectura);
    }
    return lecturas;
  }
}
