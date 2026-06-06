import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { EstadoLectura } from '../enums/estado-lectura.enum';

@Entity('lectura')
export class Lectura extends BaseEntity {
  @Column({ name: 'medidor_iot', type: 'varchar' })
  medidorIot: string;

  @Column({ name: 'contrato_id', type: 'varchar', nullable: true })
  contratoId: string | null;

  @Column({ name: 'lectura_anterior', type: 'decimal', precision: 12, scale: 3 })
  lecturaAnterior: number;

  @Column({ name: 'lectura_actual', type: 'decimal', precision: 12, scale: 3 })
  lecturaActual: number;

  @Column({ name: 'consumo_m3', type: 'decimal', precision: 12, scale: 3 })
  consumoM3: number;

  @Column({ name: 'fecha_hora_lectura', type: 'timestamp' })
  fechaHoraLectura: Date;

  @Column({ type: 'varchar', nullable: true })
  radiobase: string | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  rssi: number | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  snr: number | null;

  @Column({ type: 'enum', enum: EstadoLectura, default: EstadoLectura.NORMAL })
  estado: EstadoLectura;
}
