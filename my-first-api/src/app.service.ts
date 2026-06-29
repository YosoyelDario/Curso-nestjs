import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'TIENE QUE SER CON DOS PUNTOS :aaaaaaaaaaaaa ';
  }
}
