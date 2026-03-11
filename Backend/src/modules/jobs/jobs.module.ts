import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BlogProcessor } from './blog.processor';
import { NotificationProcessor } from './notification.processor';
import { BLOG_QUEUE, NOTIFICATION_QUEUE } from './constants';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: BLOG_QUEUE },
      { name: NOTIFICATION_QUEUE },
    ),
  ],
  providers: [BlogProcessor, NotificationProcessor],
  exports: [BullModule],
})
export class JobsModule {}
