import { Injectable } from '@nestjs/common';
import { Message } from '@orange/api-interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'hello world' };
  }
}
