import {
  Controller,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(userId, dto);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      dateOfBirth: user.dateOfBirth?.toISOString() || null,
      bio: user.bio,
      gender: user.gender,
      profileImageUrl: user.profileImageUrl,
      phoneNumber: user.phoneNumber,
      profileComplete: user.profileComplete,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
