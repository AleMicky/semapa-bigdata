import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDistritoZonaDto {
  @ApiProperty()
  @IsString()
  subalcaldia: string;

  @ApiProperty()
  @IsString()
  distrito: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subdistrito?: string;

  @ApiProperty()
  @IsString()
  zona: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  radiobase?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitud?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitud?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  habitantes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  totalContratos?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateDistritoZonaDto extends PartialType(CreateDistritoZonaDto) {}
