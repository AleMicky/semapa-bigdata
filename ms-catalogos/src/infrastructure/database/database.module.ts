import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../config/configuration';
import { Contrato } from '../../domain/entities/contrato.entity';
import { DistritoZona } from '../../domain/entities/distrito-zona.entity';
import { Infraestructura } from '../../domain/entities/infraestructura.entity';
import { Medidor } from '../../domain/entities/medidor.entity';
import { ModeloMedidor } from '../../domain/entities/modelo-medidor.entity';
import { Tarifario } from '../../domain/entities/tarifario.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        entities: [
          DistritoZona,
          Infraestructura,
          Contrato,
          ModeloMedidor,
          Medidor,
          Tarifario,
        ],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([
      DistritoZona,
      Infraestructura,
      Contrato,
      ModeloMedidor,
      Medidor,
      Tarifario,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
