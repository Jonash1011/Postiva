import {
  Injectable,
  Logger,
  Optional,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NOTIFICATION_QUEUE, NotificationJobType } from '../jobs/constants';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional()
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly notificationQueue?: Queue,
  ) {}

  async like(blogId: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    let like: Awaited<ReturnType<typeof this.prisma.like.create>>;
    try {
      like = await this.prisma.like.create({
        data: { userId, blogId },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('Already liked');
      }
      throw err;
    }

    // Queue notification for blog owner (skip if liker is the owner)
    if (blog.userId !== userId && this.notificationQueue) {
      try {
        await this.notificationQueue.add(
          NotificationJobType.NEW_LIKE,
          { blogId, userId },
          { attempts: 3, backoff: { type: 'exponential', delay: 1000 } },
        );
      } catch (err) {
        this.logger.warn(
          `Failed to queue like notification: ${(err as Error).message}`,
        );
      }
    }

    return like;
  }

  async unlike(blogId: string, userId: string) {
    const like = await this.prisma.like.findUnique({
      where: { userId_blogId: { userId, blogId } },
    });
    if (!like) throw new NotFoundException('Like not found');

    return this.prisma.like.delete({
      where: { id: like.id },
    });
  }
}
