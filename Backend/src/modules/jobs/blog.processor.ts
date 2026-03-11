import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { BLOG_QUEUE, BlogJobType } from './constants';

@Processor(BLOG_QUEUE)
export class BlogProcessor extends WorkerHost {
  private readonly logger = new Logger(BlogProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case BlogJobType.GENERATE_SUMMARY:
        await this.generateSummary(job);
        break;
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async generateSummary(job: Job<{ blogId: string }>): Promise<void> {
    const { blogId } = job.data;
    this.logger.log(`Generating summary for blog ${blogId}`);

    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) {
      this.logger.warn(`Blog ${blogId} not found, skipping summary generation`);
      return;
    }

    // Strip HTML/markdown and take first 200 characters as summary
    const plainText = blog.content
      .replace(/<[^>]*>/g, '')
      .replace(/[#*_~`>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    const summary = plainText.length > 200
      ? plainText.substring(0, 200) + '...'
      : plainText;

    await this.prisma.blog.update({
      where: { id: blogId },
      data: { summary },
    });

    this.logger.log(`Summary generated for blog ${blogId}`);
  }
}
