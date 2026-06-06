import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

@Entity('medidor')
export class Medidor extends BaseEntity {
  @Column({ name: 'medidor_iot', type: 'varchar', unique: true })
  medidorIot: string;

  @Column({ name: 'tipo_medidor_id', type: 'varchar', nullable: true })
  tipoMedidorId: string | null;

  @Column({ name: 'fecha_instalacion', type: 'date', nullable: true })
  fechaInstalacion: Date | null;

  @Column({ name: 'fecha_desinstalacion', type: 'date', nullable: true })
  fechaDesinstalacion: Date | null;

  @Column({ type: 'varchar' })
  estado: string;
}
