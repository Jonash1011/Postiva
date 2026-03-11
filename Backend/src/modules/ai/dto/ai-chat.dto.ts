import { IsString } from 'class-validator';

export class AiChatDto {
  @IsString()
  message!: string;
}
