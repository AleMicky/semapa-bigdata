import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInfraestructuraDto {
  @ApiProperty()
  @IsString()
  numeroCatastro: string;

  @ApiProperty()
  @IsString()
  propietario: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ci?: string;

  @ApiProperty()
  @IsString()
  direccion: string;

  @ApiProperty()
  @IsString()
  zona: string;

  @ApiProperty()
  @IsString()
  distrito: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manzano?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lote?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  superficieTerreno?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  areaConstruida?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  usoSuelo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  matriculaDdrr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  valorCatastral?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  impuestoAnual?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitud?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitud?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateInfraestructuraDto extends PartialType(
  CreateInfraestructuraDto,
) {}
