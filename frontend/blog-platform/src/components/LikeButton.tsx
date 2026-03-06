'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { likeService } from '@/services/likeService';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  blogId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export default function LikeButton({
  blogId,
  initialLikes,
  initialLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleToggle = async () => {
    if (!isAuthenticated || loading) return;

    setLoading(true);
    const wasLiked = liked;
    // Optimistic update
    setLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      if (wasLiked) {
        await likeService.unlikeBlog(blogId);
      } else {
        await likeService.likeBlog(blogId);
      }
    } catch {
      // Revert on error
      setLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      disabled={!isAuthenticated}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300',
        liked
          ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
          : 'bg-card/50 border-border hover:border-primary/30 text-muted-foreground hover:text-foreground',
        !isAuthenticated && 'opacity-50 cursor-not-allowed'
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={liked ? 'liked' : 'notliked'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            className={cn('h-4 w-4', liked && 'fill-red-400')}
          />
        </motion.div>
      </AnimatePresence>
      <span className="text-sm font-medium">{likes}</span>
    </motion.button>
  );
}
