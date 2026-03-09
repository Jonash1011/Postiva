import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { EditProfileDto } from './dto/edit-profile.dto';

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
        usernameChangedAt: new Date(),
        dateOfBirth: new Date(dto.dateOfBirth),
        bio: dto.bio,
        gender: dto.gender,
        profileImageUrl: dto.profileImageUrl,
        phoneNumber: dto.phoneNumber,
        profileComplete: true,
      },
    });
  }

  async editProfile(userId: string, dto: EditProfileDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const data: Record<string, any> = {};

    // Handle username change with 3-day cooldown
    if (dto.username !== undefined && dto.username !== user.username) {
      if (user.usernameChangedAt) {
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        const timeSinceChange = Date.now() - user.usernameChangedAt.getTime();
        if (timeSinceChange < threeDaysMs) {
          const remainingMs = threeDaysMs - timeSinceChange;
          const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
          throw new BadRequestException(
            `You can change your username again in ${remainingHours} hour(s)`,
          );
        }
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Username is already taken');
      }

      data.username = dto.username;
      data.usernameChangedAt = new Date();
    }

    if (dto.dateOfBirth !== undefined) {
      data.dateOfBirth = new Date(dto.dateOfBirth);
    }

    if (dto.profileImageUrl !== undefined) {
      data.profileImageUrl = dto.profileImageUrl;
    }

    if (dto.phoneNumber !== undefined) {
      data.phoneNumber = dto.phoneNumber;
    }

    if (Object.keys(data).length === 0) {
      return user;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
