import { Injectable, Logger, Optional, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NOTIFICATION_QUEUE, NotificationJobType } from '../jobs/constants';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue?: Queue,
  ) {}

  async findByBlog(blogId: string) {
    // Verify blog exists
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    return this.prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
      },
    });
  }

  async create(blogId: string, userId: string, dto: CreateCommentDto) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    const comment = await this.prisma.comment.create({
      data: {
        blogId,
        userId,
        content: dto.content,
      },
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
      },
    });

    // Queue notification for blog owner (skip if commenter is the owner)
    if (blog.userId !== userId && this.notificationQueue) {
      try {
        await this.notificationQueue.add(
          NotificationJobType.NEW_COMMENT,
          { blogId, commentId: comment.id, userId },
          { attempts: 3, backoff: { type: 'exponential', delay: 1000 } },
        );
      } catch (err) {
        this.logger.warn(`Failed to queue comment notification: ${(err as Error).message}`);
      }
    }

    return comment;
  }
}
