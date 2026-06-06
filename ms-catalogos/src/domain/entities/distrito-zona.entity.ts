import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

@Entity('distrito_zona')
export class DistritoZona extends BaseEntity {
  @Column({ type: 'varchar' })
  subalcaldia: string;

  @Column({ type: 'varchar' })
  distrito: string;

  @Column({ type: 'varchar', nullable: true })
  subdistrito: string | null;

  @Column({ type: 'varchar' })
  zona: string;

  @Column({ type: 'varchar', nullable: true })
  radiobase: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitud: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitud: number | null;

  @Column({ type: 'int', nullable: true })
  habitantes: number | null;

  @Column({ name: 'total_contratos', type: 'int', nullable: true })
  totalContratos: number | null;
}
