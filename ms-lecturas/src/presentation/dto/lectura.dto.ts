import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoLectura } from '../../domain/enums/estado-lectura.enum';

export class CreateLecturaDto {
  @ApiProperty()
  @IsString()
  medidorIot: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contratoId?: string;

  @ApiProperty()
  @IsNumber()
  lecturaAnterior: number;

  @ApiProperty()
  @IsNumber()
  lecturaActual: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaHoraLectura?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  radiobase?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rssi?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  snr?: number;

  @ApiPropertyOptional({ enum: EstadoLectura })
  @IsOptional()
  @IsEnum(EstadoLectura)
  estado?: EstadoLectura;
}

export class UpdateLecturaDto extends PartialType(CreateLecturaDto) {}

export class SimularLecturasDto {
  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumber()
  cantidad?: number;
}
