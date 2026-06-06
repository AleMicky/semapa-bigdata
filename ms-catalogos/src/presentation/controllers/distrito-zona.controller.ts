import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DistritoZona } from '../../domain/entities/distrito-zona.entity';
import { DistritoZonaService } from '../../application/services/distrito-zona.service';
import {
  CreateDistritoZonaDto,
  UpdateDistritoZonaDto,
} from '../dto/distrito-zona.dto';
import { CrudController } from './crud.controller';

@ApiTags('Distrito Zona')
@Controller('distrito-zonas')
export class DistritoZonaController extends CrudController<
  DistritoZona,
  CreateDistritoZonaDto,
  UpdateDistritoZonaDto
> {
  constructor(service: DistritoZonaService) {
    super(service);
  }
}
