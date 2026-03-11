import { Controller, Get, Param, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PublicService } from './public.service';

@Controller('public')
@Throttle({ default: { limit: 30, ttl: 60000 } })
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('feed')
  getFeed(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.publicService.getFeed(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('users/:id')
  getUserProfile(@Param('id') id: string) {
    return this.publicService.getUserProfile(id);
  }

  @Get('blogs/:slug')
  getBlogBySlug(@Param('slug') slug: string) {
    return this.publicService.getBlogBySlug(slug);
  }
}
