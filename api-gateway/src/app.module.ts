import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ProxyService } from './application/services/proxy.service';
import { CatalogosController } from './presentation/controllers/catalogos.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { LecturasController } from './presentation/controllers/lecturas.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    HttpModule,
  ],
  controllers: [HealthController, CatalogosController, LecturasController],
  providers: [ProxyService],
})
export class AppModule {}
