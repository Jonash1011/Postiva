import { User } from './user';

export interface Blog {
  id: string;
  title: string;
  content: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  isPublished: boolean;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  _count?: {
    likes: number;
    comments: number;
  };
  likes?: Like[];
}

export interface Like {
  id: string;
  userId: string;
  blogId: string;
}

export interface CreateBlogDto {
  title: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  coverImage?: string;
  isPublished?: boolean;
}

export interface FeedResponse {
  data: Blog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}