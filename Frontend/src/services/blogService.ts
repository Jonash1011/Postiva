import { api } from '@/lib/api';
import {
  Blog,
  CreateBlogDto,
  UpdateBlogDto,
  FeedResponse,
} from '@/types/blog';

export const blogService = {
  // Get all my blogs (authenticated)
  async getMyBlogs(): Promise<Blog[]> {
    return api.get<Blog[]>('/blogs');
  },

  // Get single blog by ID (authenticated)
  async getBlogById(id: string): Promise<Blog> {
    return api.get<Blog>(`/blogs/${id}`);
  },

  // Create new blog
  async createBlog(data: CreateBlogDto): Promise<Blog> {
    return api.post<Blog>('/blogs', data);
  },

  // Update blog
  async updateBlog(id: string, data: UpdateBlogDto): Promise<Blog> {
    return api.patch<Blog>(`/blogs/${id}`, data);
  },

  // Delete blog
  async deleteBlog(id: string): Promise<void> {
    return api.delete<void>(`/blogs/${id}`);
  },

  // Get public feed (with pagination)
  async getPublicFeed(page: number = 1, limit: number = 10): Promise<FeedResponse> {
    return api.get<FeedResponse>('/public/feed', { page: String(page), limit: String(limit) });
  },

  // Get blog by slug (public)
  async getBlogBySlug(slug: string): Promise<Blog> {
    return api.get<Blog>(`/public/blogs/${slug}`);
  },

  // Get user public profile + their published blogs
  async getUserProfile(id: string): Promise<any> {
    return api.get<any>(`/public/users/${id}`);
  },
};