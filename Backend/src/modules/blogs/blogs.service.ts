import {
  Injectable,
  Logger,
  Optional,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { uniqueSlugWithCheck } from '../../utils/slug-generator';
import { BLOG_QUEUE, BlogJobType } from '../jobs/constants';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() @InjectQueue(BLOG_QUEUE) private readonly blogQueue?: Queue,
  ) {}

  private async generateUniqueSlug(
    title: string,
    excludeId?: string,
  ): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return await uniqueSlugWithCheck(title, async (slug: string) => {
      const existing = await this.prisma.blog.findUnique({ where: { slug } });
      // If updating, the blog's own current slug is allowed
      return !!existing && existing.id !== excludeId;
    });
  }

  async create(userId: string, dto: CreateBlogDto) {
    const slug = await this.generateUniqueSlug(dto.title);
    const blog = await this.prisma.blog.create({
      data: {
        userId,
        title: dto.title,
        content: dto.content,
        slug,
        coverImage: dto.coverImage ?? null,
        isPublished: dto.isPublished ?? false,
      },
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    // Queue async summary generation (non-blocking)
    if (this.blogQueue) {
      try {
        await this.blogQueue.add(
          BlogJobType.GENERATE_SUMMARY,
          { blogId: blog.id },
          { attempts: 3, backoff: { type: 'exponential', delay: 1000 } },
        );
      } catch (err) {
        this.logger.warn(
          `Failed to queue summary generation for blog ${blog.id}: ${(err as Error).message}`,
        );
      }
    }

    return blog;
  }

  async findAllByUser(userId: string) {
    return this.prisma.blog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
        likes: true,
        _count: { select: { likes: true, comments: true } },
      },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId)
      throw new ForbiddenException(
        'You can only view your own unpublished blogs',
      );
    return blog;
  }

  async update(id: string, userId: string, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId)
      throw new ForbiddenException('You can only modify your own blogs');

    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) {
      data.title = dto.title;
      data.slug = await this.generateUniqueSlug(dto.title, id);
    }
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.coverImage !== undefined) data.coverImage = dto.coverImage;
    if (dto.isPublished !== undefined) data.isPublished = dto.isPublished;

    const updated = await this.prisma.blog.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    // Re-generate summary if content or title changed (non-blocking)
    if (
      (dto.title !== undefined || dto.content !== undefined) &&
      this.blogQueue
    ) {
      try {
        await this.blogQueue.add(
          BlogJobType.GENERATE_SUMMARY,
          { blogId: id },
          { attempts: 3, backoff: { type: 'exponential', delay: 1000 } },
        );
      } catch (err) {
        this.logger.warn(
          `Failed to queue summary re-generation for blog ${id}: ${(err as Error).message}`,
        );
      }
    }

    return updated;
  }

  async remove(id: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId)
      throw new ForbiddenException('You can only delete your own blogs');

    // Cascading deletes handle related likes and comments automatically
    await this.prisma.blog.delete({ where: { id } });

    return { message: 'Blog deleted successfully' };
  }
}
