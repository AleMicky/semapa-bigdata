import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeloMedidor } from '../../domain/entities/modelo-medidor.entity';
import { BaseRepository } from '../../infrastructure/repositories/base.repository';
import { CrudService } from './crud.service';

@Injectable()
export class ModeloMedidorService extends CrudService<ModeloMedidor> {
  constructor(
    @InjectRepository(ModeloMedidor)
    repository: Repository<ModeloMedidor>,
  ) {
    super(new BaseRepository(repository));
  }
}
