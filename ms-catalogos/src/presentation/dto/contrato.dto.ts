import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateContratoDto {
  @ApiProperty()
  @IsString()
  numeroContrato: string;

  @ApiProperty()
  @IsString()
  numeroCatastro: string;

  @ApiProperty()
  @IsString()
  titularContrato: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ciTitular?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty()
  @IsString()
  categoria: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subcategoria?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medidorIot?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaContrato?: string;

  @ApiProperty()
  @IsString()
  estadoContrato: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diametroConexion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tipoServicio?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateContratoDto extends PartialType(CreateContratoDto) {}
