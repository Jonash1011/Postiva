import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { NOTIFICATION_QUEUE, NotificationJobType } from './constants';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case NotificationJobType.NEW_COMMENT:
        await this.handleNewComment(job);
        break;
      case NotificationJobType.NEW_LIKE:
        await this.handleNewLike(job);
        break;
      default:
        this.logger.warn(`Unknown notification type: ${job.name}`);
    }
  }

  private async handleNewComment(
    job: Job<{ blogId: string; commentId: string; userId: string }>,
  ): Promise<void> {
    const { blogId, commentId, userId } = job.data;

    const [blog, commenter] = await Promise.all([
      this.prisma.blog.findUnique({
        where: { id: blogId },
        select: { title: true, userId: true },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, username: true },
      }),
    ]);

    if (!blog || !commenter) return;

    const commenterName = commenter.username || commenter.email;
    this.logger.log(
      `[NOTIFICATION] ${commenterName} commented on "${blog.title}" (comment: ${commentId}, blog owner: ${blog.userId})`,
    );
  }

  private async handleNewLike(
    job: Job<{ blogId: string; userId: string }>,
  ): Promise<void> {
    const { blogId, userId } = job.data;

    const [blog, liker] = await Promise.all([
      this.prisma.blog.findUnique({
        where: { id: blogId },
        select: { title: true, userId: true },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, username: true },
      }),
    ]);

    if (!blog || !liker) return;

    const likerName = liker.username || liker.email;
    this.logger.log(
      `[NOTIFICATION] ${likerName} liked "${blog.title}" (blog owner: ${blog.userId})`,
    );
  }
}
