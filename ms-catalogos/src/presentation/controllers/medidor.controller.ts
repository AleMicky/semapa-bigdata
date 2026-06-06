import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Medidor } from '../../domain/entities/medidor.entity';
import { MedidorService } from '../../application/services/medidor.service';
import { CreateMedidorDto, UpdateMedidorDto } from '../dto/medidor.dto';
import { CrudController } from './crud.controller';

@ApiTags('Medidor')
@Controller('medidores')
export class MedidorController extends CrudController<
  Medidor,
  CreateMedidorDto,
  UpdateMedidorDto
> {
  constructor(service: MedidorService) {
    super(service);
  }
}
