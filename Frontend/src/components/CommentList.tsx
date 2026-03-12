'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import CommentItem from '@/components/CommentItem';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface CommentListProps {
  blogId: string;
}

export default function CommentList({ blogId }: CommentListProps) {
  const { comments, loading, addComment } = useComments(blogId);
  const { isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addComment({ content: newComment.trim() });
      setNewComment('');
      showSuccess('Comment posted!');
    } catch {
      showError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">
          Comments {!loading && `(${comments.length})`}
        </h3>
      </div>

      {/* Comment Input */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              disabled={submitting || !newComment.trim()}
              className="gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 rounded-xl bg-muted/20 border border-border/30">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="text-primary hover:underline font-medium">
              Log in
            </Link>{' '}
            to join the conversation
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((comment, i) => (
                <CommentItem key={comment.id} comment={comment} index={i} />
              ))
            )}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
