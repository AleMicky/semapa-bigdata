import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lectura } from '../../domain/entities/lectura.entity';
import { EstadoLectura } from '../../domain/enums/estado-lectura.enum';
import { CreateLecturaDto } from '../../presentation/dto/lectura.dto';

@Injectable()
export class CrearLecturaUseCase {
  constructor(
    @InjectRepository(Lectura)
    private readonly lecturaRepository: Repository<Lectura>,
  ) {}

  async execute(dto: CreateLecturaDto): Promise<Lectura> {
    const fechaHoraLectura = dto.fechaHoraLectura
      ? new Date(dto.fechaHoraLectura)
      : new Date();

    const duplicada = await this.lecturaRepository
      .createQueryBuilder('lectura')
      .where('lectura.medidor_iot = :medidorIot', { medidorIot: dto.medidorIot })
      .andWhere('lectura.fecha_hora_lectura = :fechaHoraLectura', {
        fechaHoraLectura,
      })
      .andWhere('lectura.active = :active', { active: true })
      .getOne();

    let estado = dto.estado ?? EstadoLectura.NORMAL;
    const lecturaAnterior = Number(dto.lecturaAnterior);
    const lecturaActual = Number(dto.lecturaActual);
    let consumoM3 = lecturaActual - lecturaAnterior;

    if (duplicada) {
      estado = EstadoLectura.DUPLICADA;
    } else if (lecturaActual < lecturaAnterior) {
      estado = EstadoLectura.ERROR;
      consumoM3 = 0;
    }

    const lectura = this.lecturaRepository.create({
      medidorIot: dto.medidorIot,
      contratoId: dto.contratoId ?? null,
      lecturaAnterior,
      lecturaActual,
      consumoM3,
      fechaHoraLectura,
      radiobase: dto.radiobase ?? null,
      rssi: dto.rssi ?? null,
      snr: dto.snr ?? null,
      estado,
    });

    return this.lecturaRepository.save(lectura);
  }
}
