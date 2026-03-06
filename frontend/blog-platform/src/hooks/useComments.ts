'use client';

import { useState, useEffect } from 'react';
import { commentService } from '@/services/commentService';
import { Comment, CreateCommentDto } from '@/types/comment';

export function useComments(blogId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.getComments(blogId);
      // Sort by newest first
      setComments(data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (data: CreateCommentDto): Promise<Comment> => {
    const newComment = await commentService.createComment(blogId, data);
    setComments((prev) => [newComment, ...prev]);
    return newComment;
  };

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  return {
    comments,
    loading,
    error,
    addComment,
    refetch: fetchComments,
  };
}