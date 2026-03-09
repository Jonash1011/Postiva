import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { formatUser } from '../../utils/format-user';

@Injectable()
export class AuthService {
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.refreshSecret = this.configService.get<string>('jwt.refreshSecret')!;
    this.refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn', '7d');
  }

  private generateAccessToken(userId: string, email: string, role: string) {
    return this.jwtService.sign({ sub: userId, email, role });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(64).toString('hex');
    const days = parseInt(this.refreshExpiresIn) || 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });

    return token;
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(dto.email, passwordHash);

    const access_token = this.generateAccessToken(user.id, user.email, user.role);
    const refresh_token = await this.generateRefreshToken(user.id);

    return {
      access_token,
      refresh_token,
      user: formatUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = this.generateAccessToken(user.id, user.email, user.role);
    const refresh_token = await this.generateRefreshToken(user.id);

    return {
      access_token,
      refresh_token,
      user: formatUser(user),
    };
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      // Clean up expired token if it exists
      if (stored) {
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate: delete old token and issue a new pair
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    const user = stored.user;
    const access_token = this.generateAccessToken(user.id, user.email, user.role);
    const refresh_token = await this.generateRefreshToken(user.id);

    return {
      access_token,
      refresh_token,
      user: formatUser(user),
    };
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return formatUser(user);
  }
}
