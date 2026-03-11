import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsIn,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username!: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsString()
  @IsNotEmpty({ message: 'Bio is required' })
  @MinLength(1)
  @MaxLength(300)
  bio!: string;

  @IsString()
  @IsIn(['male', 'female'], { message: 'Gender must be male or female' })
  gender!: string;

  @IsString()
  @IsNotEmpty({ message: 'Profile image is required' })
  profileImageUrl!: string; // base64 data URI or URL

  @IsString()
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'Phone number must be a valid Indian number (+91XXXXXXXXXX)',
  })
  phoneNumber!: string;
}
