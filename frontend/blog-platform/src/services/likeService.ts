import { api } from '@/lib/api';

export const likeService = {
  // Like a blog
  async likeBlog(blogId: string): Promise<void> {
    return api.post<void>(`/blogs/${blogId}/like`);
  },

  // Unlike a blog
  async unlikeBlog(blogId: string): Promise<void> {
    return api.delete<void>(`/blogs/${blogId}/like`);
  },
};