import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Infraestructura } from '../../domain/entities/infraestructura.entity';
import { InfraestructuraService } from '../../application/services/infraestructura.service';
import {
  CreateInfraestructuraDto,
  UpdateInfraestructuraDto,
} from '../dto/infraestructura.dto';
import { CrudController } from './crud.controller';

@ApiTags('Infraestructura')
@Controller('infraestructuras')
export class InfraestructuraController extends CrudController<
  Infraestructura,
  CreateInfraestructuraDto,
  UpdateInfraestructuraDto
> {
  constructor(service: InfraestructuraService) {
    super(service);
  }
}
