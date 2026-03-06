import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { uniqueSlug } from '../../utils/slug-generator';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBlogDto) {
    const slug = uniqueSlug(dto.title);
    return this.prisma.blog.create({
      data: {
        userId,
        title: dto.title,
        content: dto.content,
        slug,
        isPublished: dto.isPublished ?? false,
      },
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
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
    if (blog.userId !== userId) throw new ForbiddenException();
    return blog;
  }

  async update(id: string, userId: string, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId) throw new ForbiddenException();

    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) {
      data.title = dto.title;
      data.slug = uniqueSlug(dto.title);
    }
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.isPublished !== undefined) data.isPublished = dto.isPublished;

    return this.prisma.blog.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  async remove(id: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    if (blog.userId !== userId) throw new ForbiddenException();

    // Delete related records first
    await this.prisma.comment.deleteMany({ where: { blogId: id } });
    await this.prisma.like.deleteMany({ where: { blogId: id } });
    await this.prisma.blog.delete({ where: { id } });

    return { message: 'Blog deleted successfully' };
  }
}
