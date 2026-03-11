import { api } from '@/lib/api';

interface ChatResponse {
  response: string;
}

interface SummaryResponse {
  summary: string;
}

export const aiService = {
  async chat(message: string): Promise<string> {
    const data = await api.post<ChatResponse>('/ai/chat', { message });
    return data.response;
  },

  async summarizeBlog(content: string): Promise<string> {
    const data = await api.post<SummaryResponse>('/ai/blog-summary', {
      content,
    });
    return data.summary;
  },
};
