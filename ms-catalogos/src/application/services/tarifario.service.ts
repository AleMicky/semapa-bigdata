import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarifario } from '../../domain/entities/tarifario.entity';
import { BaseRepository } from '../../infrastructure/repositories/base.repository';
import { CrudService } from './crud.service';

@Injectable()
export class TarifarioService extends CrudService<Tarifario> {
  constructor(
    @InjectRepository(Tarifario)
    repository: Repository<Tarifario>,
  ) {
    super(new BaseRepository(repository));
  }
}
