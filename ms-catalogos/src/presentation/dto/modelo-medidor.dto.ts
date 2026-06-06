import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateModeloMedidorDto {
  @ApiProperty()
  @IsString()
  tipoMedidorId: string;

  @ApiProperty()
  @IsString()
  marca: string;

  @ApiProperty()
  @IsString()
  modelo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tipoConectividad?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aplicacion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  datasheet?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateModeloMedidorDto extends PartialType(CreateModeloMedidorDto) {}
