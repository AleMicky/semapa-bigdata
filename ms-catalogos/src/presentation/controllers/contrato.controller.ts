import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Contrato } from '../../domain/entities/contrato.entity';
import { ContratoService } from '../../application/services/contrato.service';
import { CreateContratoDto, UpdateContratoDto } from '../dto/contrato.dto';
import { CrudController } from './crud.controller';

@ApiTags('Contrato')
@Controller('contratos')
export class ContratoController extends CrudController<
  Contrato,
  CreateContratoDto,
  UpdateContratoDto
> {
  constructor(service: ContratoService) {
    super(service);
  }
}
