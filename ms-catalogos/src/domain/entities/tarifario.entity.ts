import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

@Entity('tarifario')
export class Tarifario extends BaseEntity {
  @Column({ type: 'varchar' })
  categoria: string;

  @Column({ type: 'varchar', nullable: true })
  subcategoria: string | null;

  @Column({ name: 'fijo_12m3', type: 'decimal', precision: 10, scale: 2, nullable: true })
  fijo12m3: number | null;

  @Column({ name: 'tarifa_base', type: 'decimal', precision: 10, scale: 2, nullable: true })
  tarifaBase: number | null;

  @Column({ name: 'rango_13_25', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rango13_25: number | null;

  @Column({ name: 'rango_26_50', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rango26_50: number | null;

  @Column({ name: 'rango_51_75', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rango51_75: number | null;

  @Column({ name: 'rango_76_100', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rango76_100: number | null;

  @Column({ name: 'rango_101_150', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rango101_150: number | null;

  @Column({ name: 'rango_mayor_151', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rangoMayor151: number | null;

  @Column({ type: 'varchar', nullable: true })
  descripcion: string | null;
}
