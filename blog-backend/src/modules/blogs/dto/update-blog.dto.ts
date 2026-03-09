import {
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50000)
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  coverImage?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
