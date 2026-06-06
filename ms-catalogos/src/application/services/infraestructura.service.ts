import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Infraestructura } from '../../domain/entities/infraestructura.entity';
import { BaseRepository } from '../../infrastructure/repositories/base.repository';
import { CrudService } from './crud.service';

@Injectable()
export class InfraestructuraService extends CrudService<Infraestructura> {
  constructor(
    @InjectRepository(Infraestructura)
    repository: Repository<Infraestructura>,
  ) {
    super(new BaseRepository(repository));
  }
}
