'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import { formatDate, getReadingTime } from '@/lib/utils';
import { Blog } from '@/types/blog';

interface BlogCardProps {
  blog: Blog;
  index?: number;
}

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
  const readingTime = getReadingTime(blog.content);
  const likeCount = blog._count?.likes ?? 0;
  const commentCount = blog._count?.comments ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/blog/${blog.slug}`}>
        <Card className="group relative overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full">
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar email={blog.user.email} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{blog.user.email}</p>
                <p className="text-xs text-muted-foreground">{formatDate(blog.createdAt)}</p>
              </div>
              <Badge variant={blog.isPublished ? 'success' : 'outline'}>
                {blog.isPublished ? 'Published' : 'Draft'}
              </Badge>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {blog.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
              {blog.content.substring(0, 200)}
              {blog.content.length > 200 ? '...' : ''}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5 text-xs">
                  <Heart className="h-3.5 w-3.5" />
                  {likeCount}
                </span>
                <span className="flex items-center gap-1.5 text-xs">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {commentCount}
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
