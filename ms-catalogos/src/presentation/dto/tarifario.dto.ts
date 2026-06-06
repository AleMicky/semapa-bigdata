import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTarifarioDto {
  @ApiProperty()
  @IsString()
  categoria: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subcategoria?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fijo12m3?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  tarifaBase?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rango13_25?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rango26_50?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rango51_75?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rango76_100?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rango101_150?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rangoMayor151?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateTarifarioDto extends PartialType(CreateTarifarioDto) {}
