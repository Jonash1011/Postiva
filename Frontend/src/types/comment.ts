import { User } from './user';

export interface Comment {
  id: string;
  content: string;
  userId: string;
  blogId: string;
  user: User;
  createdAt: string;
}

export interface CreateCommentDto {
  content: string;
}