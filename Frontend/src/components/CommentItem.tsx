'use client';

import { motion } from 'framer-motion';
import Avatar from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import { Comment } from '@/types/comment';

interface CommentItemProps {
  comment: Comment;
  index?: number;
}

export default function CommentItem({ comment, index = 0 }: CommentItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex gap-3 group"
    >
      <Avatar email={comment.user.email} size="sm" className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="bg-muted/30 rounded-xl rounded-tl-sm px-4 py-3 border border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {comment.user.email}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
