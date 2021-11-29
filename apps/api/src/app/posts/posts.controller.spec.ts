import { Test, TestingModule } from '@nestjs/testing';
import { Comment, Post, PostDetails, User } from '@orange/api-interfaces';

import { CommentsService } from '../comments/services/comments.service';
import { UsersService } from '../users/services/users.service';
import { PostsController } from './posts.controller';
import { PostsService } from './services/posts.service';

describe('PostsController', () => {
  let app: TestingModule;
  let controller: PostsController;
  let postsService: PostsService;
  let usersService: UsersService;
  let commentsService: CommentsService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        { provide: PostsService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: CommentsService, useValue: {} },
      ],
    }).compile();

    controller = app.get(PostsController);

    postsService = app.get(PostsService);
    usersService = app.get(UsersService);
    commentsService = app.get(CommentsService);
  });

  describe('getPosts', () => {
    it('should get the posts', async () => {
      const expectedPosts = [{ title: 'title' }] as Post[];

      postsService.getPosts = jest.fn(() => Promise.resolve(expectedPosts));

      const posts = await controller.getPosts();

      expect(postsService.getPosts).toHaveBeenCalledTimes(1);
      expect(posts).toEqual(expectedPosts);
    });
  });

  describe('getPost', () => {
    it('should get the full post details', async () => {
      const postId = 1;
      const userId = 2;

      postsService.getPost = jest.fn(() =>
        Promise.resolve({
          title: 'title',
          body: 'body',
          userId,
        } as Post)
      );

      usersService.getUser = jest.fn(() =>
        Promise.resolve({
          username: 'username',
        } as User)
      );

      commentsService.getComments = jest.fn(() =>
        Promise.resolve([
          {
            email: 'commentEmail',
          },
        ] as Comment[])
      );

      const post = await controller.getPost(postId);

      expect(postsService.getPost).toHaveBeenCalledTimes(1);
      expect(postsService.getPost).toHaveBeenCalledWith(postId);

      expect(usersService.getUser).toHaveBeenCalledTimes(1);
      expect(usersService.getUser).toHaveBeenCalledWith(userId);

      expect(commentsService.getComments).toHaveBeenCalledTimes(1);
      expect(commentsService.getComments).toHaveBeenCalledWith(postId);

      const expectedPost = {
        id: postId,
        title: 'title',
        body: 'body',
        user: {
          username: 'username',
        },
        comments: [
          {
            email: 'commentEmail',
          },
        ],
      } as PostDetails;

      expect(post).toEqual(expectedPost);
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const post = { title: 'title' } as Post;
      const expectedNewPost: Post = {
        id: 1,
        ...post,
      };

      postsService.createPost = jest.fn(() => Promise.resolve(expectedNewPost));

      const newPost = await controller.createPost(post);

      expect(postsService.createPost).toHaveBeenCalledTimes(1);
      expect(postsService.createPost).toHaveBeenCalledWith(post);
      expect(newPost).toEqual(expectedNewPost);
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const post = { title: 'title' } as Post;
      const postId = 1;
      const expectedUpdatedPost: Post = {
        id: postId,
        ...post,
      };

      postsService.updatePost = jest.fn(() => Promise.resolve(expectedUpdatedPost));

      const updatedPost = await controller.updatePost(postId, post);

      expect(postsService.updatePost).toHaveBeenCalledTimes(1);
      expect(postsService.updatePost).toHaveBeenCalledWith({
        id: postId,
        ...post,
      });
      expect(updatedPost).toEqual(expectedUpdatedPost);
    });
  });
});
