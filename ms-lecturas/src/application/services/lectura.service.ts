import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lectura } from '../../domain/entities/lectura.entity';
import { CreateLecturaDto, UpdateLecturaDto } from '../../presentation/dto/lectura.dto';
import { CrearLecturaUseCase } from '../use-cases/crear-lectura.use-case';
import { SimularLecturasUseCase } from '../use-cases/simular-lecturas.use-case';

@Injectable()
export class LecturaService {
  constructor(
    @InjectRepository(Lectura)
    private readonly lecturaRepository: Repository<Lectura>,
    private readonly crearLecturaUseCase: CrearLecturaUseCase,
    private readonly simularLecturasUseCase: SimularLecturasUseCase,
  ) {}

  findAll(): Promise<Lectura[]> {
    return this.lecturaRepository.find({
      where: { active: true },
      order: { fechaHoraLectura: 'DESC' },
    });
  }

  async findById(id: string): Promise<Lectura> {
    const lectura = await this.lecturaRepository.findOne({
      where: { id, active: true },
    });
    if (!lectura) {
      throw new NotFoundException(`Lectura con id ${id} no encontrada`);
    }
    return lectura;
  }

  create(dto: CreateLecturaDto): Promise<Lectura> {
    return this.crearLecturaUseCase.execute(dto);
  }

  async update(id: string, dto: UpdateLecturaDto): Promise<Lectura> {
    const lectura = await this.findById(id);
    Object.assign(lectura, dto);
    if (dto.fechaHoraLectura) {
      lectura.fechaHoraLectura = new Date(dto.fechaHoraLectura);
    }
    return this.lecturaRepository.save(lectura);
  }

  async remove(id: string): Promise<void> {
    const lectura = await this.findById(id);
    lectura.active = false;
    await this.lecturaRepository.save(lectura);
  }

  simular(cantidad?: number): Promise<Lectura[]> {
    return this.simularLecturasUseCase.execute(cantidad);
  }
}
