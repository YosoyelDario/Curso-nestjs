import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.model';
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<Env>) {}
  getHello(): string {
    const myVar = this.configService.get('MY_VAR', { infer: true }) ?? '';
    return `Hello World! ${myVar}`.trim();
  }
}
