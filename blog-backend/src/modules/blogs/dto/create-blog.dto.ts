import {
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50000)
  content!: string;

  @IsString()
  @IsOptional()
  @MaxLength(15_000_000)
  coverImage?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
