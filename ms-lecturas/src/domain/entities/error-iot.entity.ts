import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

@Entity('error_iot')
export class ErrorIot extends BaseEntity {
  @Column({ name: 'codigo_error', type: 'varchar' })
  codigoError: string;

  @Column({ type: 'varchar' })
  descripcion: string;

  @Column({ name: 'gateway_id', type: 'varchar', nullable: true })
  gatewayId: string | null;

  @Column({ type: 'varchar', nullable: true })
  nombre: string | null;

  @Column({ type: 'varchar', nullable: true })
  direccion: string | null;

  @Column({ type: 'varchar', nullable: true })
  location: string | null;
}
