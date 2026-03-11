import { Module, DynamicModule, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LikesModule } from './modules/likes/likes.module';
import { PublicModule } from './modules/public/public.module';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AiModule } from './modules/ai/ai.module';
import configuration from './config/configuration';

// Only load BullMQ + Jobs when REDIS_URL is explicitly set
function conditionalBullImports(): Array<DynamicModule | typeof JobsModule> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    const logger = new Logger('AppModule');
    logger.warn(
      'REDIS_URL not set — async job queues are disabled. Set REDIS_URL to enable them.',
    );
    return [];
  }
  const parsed = new URL(redisUrl);
  return [
    BullModule.forRoot({
      connection: {
        host: parsed.hostname || 'localhost',
        port: parseInt(parsed.port || '6379', 10),
        ...(parsed.password ? { password: decodeURIComponent(parsed.password) } : {}),
        maxRetriesPerRequest: null,
      },
    }),
    JobsModule,
  ];
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Global rate limiting: 10 requests per 60 seconds by default
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000,
          limit: 10,
        },
      ],
    }),

    // BullMQ + Jobs (conditionally loaded when REDIS_URL is set)
    ...conditionalBullImports(),

    PrismaModule,
    AuthModule,
    BlogsModule,
    CommentsModule,
    LikesModule,
    PublicModule,
    UsersModule,
    AiModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
