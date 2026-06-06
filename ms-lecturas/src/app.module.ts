import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CrearLecturaUseCase } from './application/use-cases/crear-lectura.use-case';
import { SimularLecturasUseCase } from './application/use-cases/simular-lecturas.use-case';
import { ErrorIotService } from './application/services/error-iot.service';
import { LecturaService } from './application/services/lectura.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ErrorIotController } from './presentation/controllers/error-iot.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { LecturaController } from './presentation/controllers/lectura.controller';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [HealthController, LecturaController, ErrorIotController],
  providers: [
    CrearLecturaUseCase,
    SimularLecturasUseCase,
    LecturaService,
    ErrorIotService,
  ],
})
export class AppModule {}
