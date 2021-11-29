import { Module } from '@nestjs/common';

import { CommentsService } from '../comments/services/comments.service';
import { UsersService } from '../users/services/users.service';
import { PostsController } from './posts.controller';
import { PostsService } from './services/posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, UsersService, CommentsService],
})
export class PostsModule {}
