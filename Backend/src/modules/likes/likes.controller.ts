import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('blogs/:blogId/like')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } })
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  like(@Param('blogId') blogId: string, @CurrentUser('id') userId: string) {
    return this.likesService.like(blogId, userId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  unlike(@Param('blogId') blogId: string, @CurrentUser('id') userId: string) {
    return this.likesService.unlike(blogId, userId);
  }
}
