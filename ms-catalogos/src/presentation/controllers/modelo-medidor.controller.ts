import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModeloMedidor } from '../../domain/entities/modelo-medidor.entity';
import { ModeloMedidorService } from '../../application/services/modelo-medidor.service';
import {
  CreateModeloMedidorDto,
  UpdateModeloMedidorDto,
} from '../dto/modelo-medidor.dto';
import { CrudController } from './crud.controller';

@ApiTags('Modelo Medidor')
@Controller('modelos-medidor')
export class ModeloMedidorController extends CrudController<
  ModeloMedidor,
  CreateModeloMedidorDto,
  UpdateModeloMedidorDto
> {
  constructor(service: ModeloMedidorService) {
    super(service);
  }
}
