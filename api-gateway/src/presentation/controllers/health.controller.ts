import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProxyService } from '../../application/services/proxy.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  async check() {
    const [catalogos, lecturas] = await Promise.allSettled([
      this.proxyService.forward('catalogos', '/health'),
      this.proxyService.forward('lecturas', '/health'),
    ]);

    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      downstream: {
        catalogos:
          catalogos.status === 'fulfilled' ? catalogos.value : { status: 'down' },
        lecturas:
          lecturas.status === 'fulfilled' ? lecturas.value : { status: 'down' },
      },
    };
  }
}
