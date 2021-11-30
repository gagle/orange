import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator/jest';
import { Post } from '@orange/api-interfaces';
import { firstValueFrom, of, throwError } from 'rxjs';

import { PostsService } from '../../../api';
import { OverviewStoreService } from './overview.store.service';

describe('OverviewStoreService', () => {
  let spectator: SpectatorService<OverviewStoreService>;
  let service: OverviewStoreService;
  let postsService: PostsService;

  const createService = createServiceFactory({
    service: OverviewStoreService,
    providers: [mockProvider(PostsService, {})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    postsService = spectator.inject(PostsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('loadPosts', () => {
    it('should load posts', async () => {
      const userId = '2';
      const expectedPosts = [{ id: 1 }] as Post[];

      postsService.getPosts = jest.fn(() => of(expectedPosts));

      const postsList: Post[][] = [];
      service.posts$.subscribe(posts => {
        postsList.push(posts);
      });

      const posts = await firstValueFrom(service.loadPosts(userId));

      expect(postsService.getPosts).toHaveBeenCalledTimes(1);
      expect(postsService.getPosts).toHaveBeenCalledWith(userId);
      expect(posts).toEqual(expectedPosts);
      expect(postsList).toEqual([[], posts]);
    });

    it('should return error', () => {
      postsService.getPosts = jest.fn(() => throwError(() => new Error('error')));
      const userId = '2';

      const postsList: Post[][] = [];
      service.posts$.subscribe(posts => {
        postsList.push(posts);
      });

      service.loadPosts(userId).subscribe();

      expect(postsService.getPosts).toHaveBeenCalledTimes(1);
      expect(postsService.getPosts).toHaveBeenCalledWith(userId);
      expect(postsList).toEqual([[]]);
    });
  });
});
