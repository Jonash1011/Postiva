import {
  IsString,
  IsOptional,
  IsDateString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class EditProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000000) // ~5MB base64
  profileImageUrl?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'Phone number must be a valid Indian number (+91XXXXXXXXXX)',
  })
  phoneNumber?: string;
}
