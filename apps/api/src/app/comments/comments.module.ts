import { Module } from '@nestjs/common';

import { CommentsService } from './services/comments.service';

@Module({
  providers: [CommentsService],
})
export class CommentsModule {}
