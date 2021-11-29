import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CommentsModule } from './comments/comments.module';
import { configuration } from './config/configuration';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    PostsModule,
    UsersModule,
    CommentsModule,
  ],
})
export class AppModule {}
