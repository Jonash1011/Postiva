import { api } from '@/lib/api';
import { Comment, CreateCommentDto } from '@/types/comment';

export const commentService = {
  // Get comments for a blog
  async getComments(blogId: string): Promise<Comment[]> {
    return api.get<Comment[]>(`/blogs/${blogId}/comments`);
  },

  // Create a comment
  async createComment(blogId: string, data: CreateCommentDto): Promise<Comment> {
    return api.post<Comment>(`/blogs/${blogId}/comments`, data);
  },
};