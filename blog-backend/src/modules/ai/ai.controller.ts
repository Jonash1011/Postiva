import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiChatDto } from './dto/ai-chat.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() dto: AiChatDto) {
    const reply = await this.aiService.askAssistant(dto.message);

    return {
      response: reply,
    };
  }

  @Post('blog-summary')
  async summarize(@Body() body: { content: string }) {
    const summary = await this.aiService.summarizeBlog(body.content);

    return { summary };
  }
}
