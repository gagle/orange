import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Comment } from '@orange/api-interfaces';
import { request } from 'undici';

import { Configuration } from '../../config/configuration';

@Injectable()
export class CommentsService {
  private readonly jsonPlaceholderBaseUrl = this.configService.get('apis.jsonPlaceholder.baseUrl', { infer: true });

  constructor(private configService: ConfigService<Configuration>) {}

  async getComments(postId: number): Promise<Comment[]> {
    const { body } = await request(`${this.jsonPlaceholderBaseUrl}/posts/${postId}/comments`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    });
    return body.json();
  }
}
