import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProxyService } from '../../application/services/proxy.service';

@ApiTags('Catálogos')
@Controller('catalogos')
export class CatalogosController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('contratos')
  getContratos() {
    return this.proxyService.forward('catalogos', '/contratos');
  }

  @Get('medidores')
  getMedidores() {
    return this.proxyService.forward('catalogos', '/medidores');
  }
}
