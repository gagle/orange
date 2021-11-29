import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@orange/api-interfaces';
import { request } from 'undici';

import { Configuration } from '../../config/configuration';

@Injectable()
export class UsersService {
  private readonly jsonPlaceholderBaseUrl = this.configService.get('apis.jsonPlaceholder.baseUrl', { infer: true });

  constructor(private configService: ConfigService<Configuration>) {}

  async getUser(userId: number): Promise<User> {
    const { body } = await request(`${this.jsonPlaceholderBaseUrl}/users/${userId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    });
    return body.json();
  }
}
