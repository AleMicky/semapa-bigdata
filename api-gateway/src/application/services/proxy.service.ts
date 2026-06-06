import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async forward<T>(
    service: 'catalogos' | 'lecturas',
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const baseUrl = this.configService.get<string>(`services.${service}`);
    const response = await firstValueFrom(
      this.httpService.request<T>({
        url: `${baseUrl}${path}`,
        ...config,
      }),
    );
    return response.data;
  }
}
