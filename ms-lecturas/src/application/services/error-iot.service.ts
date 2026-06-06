import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorIot } from '../../domain/entities/error-iot.entity';
import {
  CreateErrorIotDto,
  UpdateErrorIotDto,
} from '../../presentation/dto/error-iot.dto';

@Injectable()
export class ErrorIotService {
  constructor(
    @InjectRepository(ErrorIot)
    private readonly errorIotRepository: Repository<ErrorIot>,
  ) {}

  findAll(): Promise<ErrorIot[]> {
    return this.errorIotRepository.find({ where: { active: true } });
  }

  async findById(id: string): Promise<ErrorIot> {
    const error = await this.errorIotRepository.findOne({
      where: { id, active: true },
    });
    if (!error) {
      throw new NotFoundException(`Error IoT con id ${id} no encontrado`);
    }
    return error;
  }

  create(dto: CreateErrorIotDto): Promise<ErrorIot> {
    const error = this.errorIotRepository.create(dto);
    return this.errorIotRepository.save(error);
  }

  async update(id: string, dto: UpdateErrorIotDto): Promise<ErrorIot> {
    const error = await this.findById(id);
    Object.assign(error, dto);
    return this.errorIotRepository.save(error);
  }

  async remove(id: string): Promise<void> {
    const error = await this.findById(id);
    error.active = false;
    await this.errorIotRepository.save(error);
  }
}
