import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Post } from '@orange/api-interfaces';
import { OptionalWithRequiredId } from '@orange/common';
import { request } from 'undici';

import { PostsService } from './posts.service';

jest.mock('undici', () => ({
  request: jest.fn(() =>
    Promise.resolve({
      body: {
        json: () => Promise.resolve(),
      },
    })
  ),
}));

describe('PostsService', () => {
  let service: PostsService;

  const configServiceStub: Partial<ConfigService> = {
    get: (key: string) => (key === 'apis.jsonPlaceholder.baseUrl' ? 'jsonPlaceholderBaseUrl' : null),
  };

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [PostsService, { provide: ConfigService, useValue: configServiceStub }],
    }).compile();

    service = app.get(PostsService);
  });

  describe('getPosts', () => {
    it('should make the GET call', async () => {
      const userId = undefined;
      await service.getPosts(userId);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        'jsonPlaceholderBaseUrl/posts',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should filter by userId', async () => {
      (request as jest.Mock).mockReturnValue(
        Promise.resolve({
          body: {
            json: () => Promise.resolve([{ userId: 1 }, { userId: 2 }] as Post[]),
          },
        })
      );
      const userId = 1;

      const posts = await service.getPosts(userId);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        'jsonPlaceholderBaseUrl/posts',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(posts).toEqual([{ userId: 1 }] as Post[]);
    });
  });

  describe('getPost', () => {
    it('should make the GET call', async () => {
      const postId = 1;

      await service.getPost(postId);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `jsonPlaceholderBaseUrl/posts/${postId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('createPost', () => {
    it('should make the POST call', async () => {
      const post: Post = {
        userId: 1,
        title: 'title',
        body: 'body',
      };

      await service.createPost(post);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        'jsonPlaceholderBaseUrl/posts',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(post),
        })
      );
    });
  });

  describe('updatePost', () => {
    it('should make the PUT call', async () => {
      const postId = 1;
      const post: OptionalWithRequiredId<Post, 'id'> = {
        id: postId,
        body: 'body',
      };

      await service.updatePost(post);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `jsonPlaceholderBaseUrl/posts/${postId}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(post),
        })
      );
    });
  });
});
