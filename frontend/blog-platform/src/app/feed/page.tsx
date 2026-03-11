'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rss, PenSquare } from 'lucide-react';
import { useFeed } from '@/hooks/useBlogs';
import BlogCard from '@/components/BlogCard';
import { FeedSkeleton } from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FeedPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { feed, loading, error } = useFeed(currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Rss className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Blog Feed</h1>
            <p className="text-sm text-muted-foreground">
              Discover stories from writers everywhere
            </p>
          </div>
        </div>
        <Link href="/dashboard/create">
          <Button variant="gradient" size="sm" className="gap-2">
            <PenSquare className="h-4 w-4" />
            New Blog
          </Button>
        </Link>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <FeedSkeleton />
      ) : !feed || feed.data.length === 0 ? (
        <EmptyState
          title="No blogs yet"
          description="Be the first to write a blog post and share your ideas!"
          action={
            <Link href="/dashboard/create">
              <Button variant="gradient" className="gap-2">
                <PenSquare className="h-4 w-4" />
                Create Blog
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feed.data.map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} index={i} />
            ))}
          </div>

          {feed.meta && (
            <Pagination
              currentPage={feed.meta.page}
              totalPages={feed.meta.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}