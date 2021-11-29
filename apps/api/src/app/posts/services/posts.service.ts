import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Post } from '@orange/api-interfaces';
import { OptionalWithRequiredId } from '@orange/common';
import { request } from 'undici';

import { Configuration } from '../../config/configuration';

/**
 * In a real application, interfaces for the GET, POST and PUT are typically
 * separated in specific files to avoid coupling, ie.: Post, PostCreate and
 * PostUpdate, but to make things easier (also based on the interfaces of
 * jsonplaceholder) there is a unique Post interface.
 */
@Injectable()
export class PostsService {
  private readonly jsonPlaceholderBaseUrl = this.configService.get('apis.jsonPlaceholder.baseUrl', { infer: true });

  constructor(private configService: ConfigService<Configuration>) {}

  async getPosts(userId: number | undefined): Promise<Post[]> {
    const { body } = await request(`${this.jsonPlaceholderBaseUrl}/posts`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    });
    const posts: Post[] = await body.json();
    return userId === undefined ? posts : posts.filter(post => post.userId === userId);
  }

  async getPost(postId: number): Promise<Post> {
    const { body } = await request(`${this.jsonPlaceholderBaseUrl}/posts/${postId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    });
    return body.json();
  }

  async createPost(post: Post): Promise<Post> {
    const { body } = await request(`${this.jsonPlaceholderBaseUrl}/posts`, {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    });
    return body.json();
  }

  async updatePost(post: OptionalWithRequiredId<Post, 'id'>): Promise<Post> {
    const { body } = await request(`${this.jsonPlaceholderBaseUrl}/posts/${post.id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    });
    return body.json();
  }
}
