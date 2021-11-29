import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { request } from 'undici';

import { UsersService } from './users.service';

jest.mock('undici', () => ({
  request: jest.fn(() =>
    Promise.resolve({
      body: {
        json: () => Promise.resolve(),
      },
    })
  ),
}));

describe('UsersService', () => {
  let service: UsersService;

  const configServiceStub: Partial<ConfigService> = {
    get: (key: string) => (key === 'apis.jsonPlaceholder.baseUrl' ? 'jsonPlaceholderBaseUrl' : null),
  };

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [UsersService, { provide: ConfigService, useValue: configServiceStub }],
    }).compile();

    service = app.get(UsersService);
  });

  describe('getUser', () => {
    it('should make the GET call', async () => {
      const userId = 1;

      await service.getUser(userId);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `jsonPlaceholderBaseUrl/users/${userId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });
});
