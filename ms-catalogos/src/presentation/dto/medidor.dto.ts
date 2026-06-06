import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMedidorDto {
  @ApiProperty()
  @IsString()
  medidorIot: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tipoMedidorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaInstalacion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaDesinstalacion?: string;

  @ApiProperty()
  @IsString()
  estado: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateMedidorDto extends PartialType(CreateMedidorDto) {}
