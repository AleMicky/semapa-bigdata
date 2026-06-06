import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

@Entity('contrato')
export class Contrato extends BaseEntity {
  @Column({ name: 'numero_contrato', type: 'varchar', unique: true })
  numeroContrato: string;

  @Column({ name: 'numero_catastro', type: 'varchar' })
  numeroCatastro: string;

  @Column({ name: 'titular_contrato', type: 'varchar' })
  titularContrato: string;

  @Column({ name: 'ci_titular', type: 'varchar', nullable: true })
  ciTitular: string | null;

  @Column({ type: 'varchar', nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar' })
  categoria: string;

  @Column({ type: 'varchar', nullable: true })
  subcategoria: string | null;

  @Column({ name: 'medidor_iot', type: 'varchar', nullable: true })
  medidorIot: string | null;

  @Column({ name: 'fecha_contrato', type: 'date', nullable: true })
  fechaContrato: Date | null;

  @Column({ name: 'estado_contrato', type: 'varchar' })
  estadoContrato: string;

  @Column({ name: 'diametro_conexion', type: 'varchar', nullable: true })
  diametroConexion: string | null;

  @Column({ name: 'tipo_servicio', type: 'varchar', nullable: true })
  tipoServicio: string | null;
}
