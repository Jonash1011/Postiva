import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async like(blogId: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    const existing = await this.prisma.like.findUnique({
      where: { userId_blogId: { userId, blogId } },
    });
    if (existing) throw new ConflictException('Already liked');

    return this.prisma.like.create({
      data: { userId, blogId },
    });
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
