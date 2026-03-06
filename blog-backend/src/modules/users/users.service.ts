import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(email: string, passwordHash: string): Promise<User> {
    return this.prisma.user.create({
      data: { email, passwordHash },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    // Check if username is already taken by another user
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Username is already taken');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        username: dto.username,
        dateOfBirth: new Date(dto.dateOfBirth),
        bio: dto.bio || null,
        gender: dto.gender,
        profileImageUrl: dto.profileImageUrl || null,
        phoneNumber: dto.phoneNumber,
        profileComplete: true,
      },
    });
  }
}
