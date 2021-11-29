import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { request } from 'undici';

import { CommentsService } from './comments.service';

jest.mock('undici', () => ({
  request: jest.fn(() =>
    Promise.resolve({
      body: {
        json: () => Promise.resolve(),
      },
    })
  ),
}));

describe('CommentsService', () => {
  let service: CommentsService;

  const configServiceStub: Partial<ConfigService> = {
    get: (key: string) => (key === 'apis.jsonPlaceholder.baseUrl' ? 'jsonPlaceholderBaseUrl' : null),
  };

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [CommentsService, { provide: ConfigService, useValue: configServiceStub }],
    }).compile();

    service = app.get(CommentsService);
  });

  describe('getComments', () => {
    it('should make the GET call', async () => {
      const postId = 1;

      await service.getComments(postId);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `jsonPlaceholderBaseUrl/posts/${postId}/comments`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });
});
