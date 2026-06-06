import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistritoZona } from '../../domain/entities/distrito-zona.entity';
import { BaseRepository } from '../../infrastructure/repositories/base.repository';
import { CrudService } from './crud.service';

@Injectable()
export class DistritoZonaService extends CrudService<DistritoZona> {
  constructor(
    @InjectRepository(DistritoZona)
    repository: Repository<DistritoZona>,
  ) {
    super(new BaseRepository(repository));
  }
}
