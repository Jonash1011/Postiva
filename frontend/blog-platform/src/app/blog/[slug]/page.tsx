'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useBlog } from '@/hooks/useBlogs';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/Loading';
import LikeButton from '@/components/LikeButton';
import CommentList from '@/components/CommentList';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDate, getReadingTime } from '@/lib/utils';
import Link from 'next/link';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { blog, loading, error } = useBlog(slug);
  const { user } = useAuth();

  if (loading) return <Loading />;

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Blog not found</h2>
        <p className="text-muted-foreground mb-6">
          {error || 'The blog you are looking for does not exist.'}
        </p>
        <Link href="/feed">
          <Button variant="outline">Back to Feed</Button>
        </Link>
      </div>
    );
  }

  const likeCount = blog._count?.likes || 0;
  const isLiked = user ? blog.likes?.some((like) => like.userId === user.id) || false : false;
  const readingTime = getReadingTime(blog.content);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link href="/feed">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Button>
        </Link>
      </motion.div>

      {/* Article */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-border">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full max-h-[400px] object-cover"
            />
          </div>
        )}

        {/* Author Bar */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar email={blog.user.email} size="md" />
            <div>
              <p className="text-sm font-medium">{blog.user.email}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(blog.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime} min read
                </span>
              </div>
            </div>
          </div>

          <LikeButton blogId={blog.id} initialLikes={likeCount} initialLiked={isLiked} />
        </div>

        {/* Content */}
        <div className="prose-blog mb-12">
          <div className="whitespace-pre-wrap leading-relaxed text-foreground/85">
            {blog.content}
          </div>
        </div>
      </motion.article>

      {/* Comments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl border border-border bg-card/30 p-6 sm:p-8"
      >
        <CommentList blogId={blog.id} />
      </motion.div>
    </div>
  );
}