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
import { ErrorIot } from '../../domain/entities/error-iot.entity';
import { ErrorIotService } from '../../application/services/error-iot.service';
import {
  CreateErrorIotDto,
  UpdateErrorIotDto,
} from '../dto/error-iot.dto';

@ApiTags('Error IoT')
@Controller('errores-iot')
export class ErrorIotController {
  constructor(private readonly errorIotService: ErrorIotService) {}

  @Get()
  findAll(): Promise<ErrorIot[]> {
    return this.errorIotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ErrorIot> {
    return this.errorIotService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateErrorIotDto): Promise<ErrorIot> {
    return this.errorIotService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateErrorIotDto,
  ): Promise<ErrorIot> {
    return this.errorIotService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.errorIotService.remove(id);
  }
}
