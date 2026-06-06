import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato } from '../../domain/entities/contrato.entity';
import { BaseRepository } from '../../infrastructure/repositories/base.repository';
import { CrudService } from './crud.service';

@Injectable()
export class ContratoService extends CrudService<Contrato> {
  constructor(
    @InjectRepository(Contrato)
    repository: Repository<Contrato>,
  ) {
    super(new BaseRepository(repository));
  }
}
