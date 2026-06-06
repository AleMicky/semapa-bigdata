import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

@Entity('infraestructura')
export class Infraestructura extends BaseEntity {
  @Column({ name: 'numero_catastro', type: 'varchar', unique: true })
  numeroCatastro: string;

  @Column({ type: 'varchar' })
  propietario: string;

  @Column({ type: 'varchar', nullable: true })
  ci: string | null;

  @Column({ type: 'varchar' })
  direccion: string;

  @Column({ type: 'varchar' })
  zona: string;

  @Column({ type: 'varchar' })
  distrito: string;

  @Column({ type: 'varchar', nullable: true })
  manzano: string | null;

  @Column({ type: 'varchar', nullable: true })
  lote: string | null;

  @Column({
    name: 'superficie_terreno',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  superficieTerreno: number | null;

  @Column({
    name: 'area_construida',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  areaConstruida: number | null;

  @Column({ name: 'uso_suelo', type: 'varchar', nullable: true })
  usoSuelo: string | null;

  @Column({ name: 'matricula_ddrr', type: 'varchar', nullable: true })
  matriculaDdrr: string | null;

  @Column({
    name: 'valor_catastral',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  valorCatastral: number | null;

  @Column({
    name: 'impuesto_anual',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  impuestoAnual: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitud: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitud: number | null;
}
