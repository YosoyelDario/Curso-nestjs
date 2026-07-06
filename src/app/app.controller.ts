import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: '¡Bienvenido a la API del curso de NestJS!',
      status: 'success',
      version: '1.0.0',
    };
  }
}
