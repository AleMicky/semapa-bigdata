import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Lectura } from '../../domain/entities/lectura.entity';
import { LecturaService } from '../../application/services/lectura.service';
import {
  CreateLecturaDto,
  SimularLecturasDto,
  UpdateLecturaDto,
} from '../dto/lectura.dto';

@ApiTags('Lectura')
@Controller('lecturas')
export class LecturaController {
  constructor(private readonly lecturaService: LecturaService) {}

  @Get()
  findAll(): Promise<Lectura[]> {
    return this.lecturaService.findAll();
  }

  @Post('simular')
  simular(@Body() dto: SimularLecturasDto): Promise<Lectura[]> {
    return this.lecturaService.simular(dto.cantidad ?? 10);
  }

  @Post()
  create(@Body() dto: CreateLecturaDto): Promise<Lectura> {
    return this.lecturaService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Lectura> {
    return this.lecturaService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLecturaDto,
  ): Promise<Lectura> {
    return this.lecturaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.lecturaService.remove(id);
  }
}
