import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medidor } from '../../domain/entities/medidor.entity';
import { BaseRepository } from '../../infrastructure/repositories/base.repository';
import { CrudService } from './crud.service';

@Injectable()
export class MedidorService extends CrudService<Medidor> {
  constructor(
    @InjectRepository(Medidor)
    repository: Repository<Medidor>,
  ) {
    super(new BaseRepository(repository));
  }
}
