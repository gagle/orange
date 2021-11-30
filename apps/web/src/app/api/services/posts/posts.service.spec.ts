import { createHttpFactory, HttpMethod, SpectatorHttp } from '@ngneat/spectator/jest';
import { Post, PostDetails } from '@orange/api-interfaces';

import { apiUrl } from '../../config/config';
import { PostsService } from './posts.service';

describe('PostService', () => {
  let spectator: SpectatorHttp<PostsService>;
  const createHttp = createHttpFactory(PostsService);

  beforeEach(() => (spectator = createHttp()));

  describe('getPosts', () => {
    it('should return the list of posts', () => {
      let expectedPosts: Post[];

      spectator.service.getPosts().subscribe(posts => {
        expectedPosts = posts;
      });

      const request = spectator.expectOne(`${apiUrl}/posts`, HttpMethod.GET);

      const response: Post[] = [];
      request.flush(response);

      expect(expectedPosts!).toEqual(response);
    });

    it('should filter by userId', () => {
      let expectedPosts: Post[];
      const userId = '1';

      spectator.service.getPosts(userId).subscribe(posts => {
        expectedPosts = posts;
      });

      const request = spectator.expectOne(`${apiUrl}/posts?userId=${userId}`, HttpMethod.GET);

      const response: Post[] = [];
      request.flush(response);

      expect(expectedPosts!).toEqual(response);
    });
  });

  describe('getPost', () => {
    it('should return the details of a post', () => {
      let expectedPost: PostDetails;

      const postId = 1;

      spectator.service.getPost(postId).subscribe(post => {
        expectedPost = post;
      });

      const request = spectator.expectOne(`${apiUrl}/posts/${postId}`, HttpMethod.GET);

      const response = {} as PostDetails;
      request.flush(response);

      expect(expectedPost!).toEqual(response);
    });
  });

  describe('createPost', () => {
    it('should create a post', () => {
      const post: Post = {
        userId: 1,
        title: 'title',
        body: 'body',
      };

      spectator.service.createPost(post).subscribe();

      const request = spectator.expectOne(`${apiUrl}/post`, HttpMethod.POST);

      expect(request.request.body).toEqual(post);
    });
  });

  describe('updatePost', () => {
    it('should update a post', () => {
      const post: Post = {
        userId: 1,
        title: 'title',
        body: 'body',
      };

      spectator.service.updatePost(post).subscribe();

      const request = spectator.expectOne(`${apiUrl}/post`, HttpMethod.PUT);

      expect(request.request.body).toEqual(post);
    });
  });
});
