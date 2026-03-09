import {
  Controller,
  Patch,
  Get,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { formatUser } from '../../utils/format-user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('id') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return formatUser(user);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(userId, dto);
    return formatUser(user);
  }

  @Patch('profile/edit')
  @UseGuards(JwtAuthGuard)
  async editProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: EditProfileDto,
  ) {
    const user = await this.usersService.editProfile(userId, dto);
    return formatUser(user);
  }
}
