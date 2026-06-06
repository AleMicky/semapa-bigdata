import { Module } from '@nestjs/common';
import { ContratoService } from './application/services/contrato.service';
import { DistritoZonaService } from './application/services/distrito-zona.service';
import { InfraestructuraService } from './application/services/infraestructura.service';
import { MedidorService } from './application/services/medidor.service';
import { ModeloMedidorService } from './application/services/modelo-medidor.service';
import { TarifarioService } from './application/services/tarifario.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ContratoController } from './presentation/controllers/contrato.controller';
import { DistritoZonaController } from './presentation/controllers/distrito-zona.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { InfraestructuraController } from './presentation/controllers/infraestructura.controller';
import { MedidorController } from './presentation/controllers/medidor.controller';
import { ModeloMedidorController } from './presentation/controllers/modelo-medidor.controller';
import { TarifarioController } from './presentation/controllers/tarifario.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    HealthController,
    DistritoZonaController,
    InfraestructuraController,
    ContratoController,
    ModeloMedidorController,
    MedidorController,
    TarifarioController,
  ],
  providers: [
    DistritoZonaService,
    InfraestructuraService,
    ContratoService,
    ModeloMedidorService,
    MedidorService,
    TarifarioService,
  ],
})
export class AppModule {}
