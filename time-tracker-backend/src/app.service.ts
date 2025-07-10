import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): string {
    return 'OK';
  }

  getVersion(): string {
    return '1.0.0';
  }

  getPing(): string {
    return 'pong';
  }
}
