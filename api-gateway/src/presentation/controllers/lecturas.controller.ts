import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProxyService } from '../../application/services/proxy.service';

@ApiTags('Lecturas')
@Controller('lecturas')
export class LecturasController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  getLecturas() {
    return this.proxyService.forward('lecturas', '/lecturas');
  }

  @Post('simular')
  simularLecturas(@Body() body: Record<string, unknown>) {
    return this.proxyService.forward('lecturas', '/lecturas/simular', {
      method: 'POST',
      data: body,
    });
  }

  @Post()
  createLectura(@Body() body: Record<string, unknown>) {
    return this.proxyService.forward('lecturas', '/lecturas', {
      method: 'POST',
      data: body,
    });
  }
}
