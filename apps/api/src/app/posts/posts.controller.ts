import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Post as ApiPost, PostDetails } from '@orange/api-interfaces';

import { CommentsService } from '../comments/services/comments.service';
import { UsersService } from '../users/services/users.service';
import { PostsService } from './services/posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService
  ) {}

  @Get()
  getPosts(): Promise<ApiPost[]> {
    return this.postsService.getPosts();
  }

  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) postId: number): Promise<PostDetails> {
    const post = await this.postsService.getPost(postId);
    const user = await this.usersService.getUser(post.userId);
    const comments = await this.commentsService.getComments(postId);
    return {
      id: postId,
      title: post.title,
      body: post.body,
      user,
      comments,
    };
  }

  @Post()
  createPost(@Body() post: Omit<ApiPost, 'id'>): Promise<ApiPost> {
    return this.postsService.createPost(post);
  }

  @Put(':id')
  updatePost(@Param('id', ParseIntPipe) postId: number, @Body() post: Omit<ApiPost, 'id'>): Promise<ApiPost> {
    return this.postsService.updatePost({
      id: postId,
      ...post,
    });
  }
}
