import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

@Entity('modelo_medidor')
export class ModeloMedidor extends BaseEntity {
  @Column({ name: 'tipo_medidor_id', type: 'varchar', unique: true })
  tipoMedidorId: string;

  @Column({ type: 'varchar' })
  marca: string;

  @Column({ type: 'varchar' })
  modelo: string;

  @Column({ name: 'tipo_conectividad', type: 'varchar', nullable: true })
  tipoConectividad: string | null;

  @Column({ type: 'varchar', nullable: true })
  aplicacion: string | null;

  @Column({ type: 'varchar', nullable: true })
  datasheet: string | null;
}
