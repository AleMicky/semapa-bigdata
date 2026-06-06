import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Tarifario } from '../../domain/entities/tarifario.entity';
import { TarifarioService } from '../../application/services/tarifario.service';
import { CreateTarifarioDto, UpdateTarifarioDto } from '../dto/tarifario.dto';
import { CrudController } from './crud.controller';

@ApiTags('Tarifario')
@Controller('tarifarios')
export class TarifarioController extends CrudController<
  Tarifario,
  CreateTarifarioDto,
  UpdateTarifarioDto
> {
  constructor(service: TarifarioService) {
    super(service);
  }
}
