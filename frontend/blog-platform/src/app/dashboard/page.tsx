'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenSquare,
  Eye,
  Heart,
  MessageCircle,
  Trash2,
  Edit3,
  ExternalLink,
  LayoutDashboard,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBlogs } from '@/hooks/useBlogs';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import DashboardStatsCard from '@/components/DashboardStatsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { blogs, loading, error, fetchMyBlogs, deleteBlog } = useBlogs();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyBlogs();
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
      } catch {
        alert('Failed to delete blog');
      }
    }
  };

  if (authLoading || loading) return <Loading />;
  if (!isAuthenticated) return null;

  const totalLikes = blogs.reduce((sum, b) => sum + (b._count?.likes || 0), 0);
  const totalComments = blogs.reduce((sum, b) => sum + (b._count?.comments || 0), 0);
  const publishedCount = blogs.filter((b) => b.isPublished).length;

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
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
        </div>
        <Link href="/dashboard/create">
          <Button variant="gradient" className="gap-2">
            <PenSquare className="h-4 w-4" />
            New Blog
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <DashboardStatsCard
          title="Total Posts"
          value={blogs.length}
          icon={FileText}
          color="primary"
          index={0}
        />
        <DashboardStatsCard
          title="Published"
          value={publishedCount}
          icon={Eye}
          color="accent"
          index={1}
        />
        <DashboardStatsCard
          title="Total Likes"
          value={totalLikes}
          icon={Heart}
          color="secondary"
          index={2}
        />
        <DashboardStatsCard
          title="Comments"
          value={totalComments}
          icon={MessageCircle}
          color="primary"
          index={3}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Blog List */}
      {blogs.length === 0 ? (
        <EmptyState
          title="No blogs yet"
          description="Start writing your first blog post and share it with the world."
          icon={PenSquare}
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
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                    Engagement
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Created
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {blogs.map((blog, i) => (
                    <motion.tr
                      key={blog.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 hover:bg-card/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          {blog.title}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={blog.isPublished ? 'success' : 'outline'}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {blog._count?.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" /> {blog._count?.comments || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/dashboard/edit/${blog.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(blog.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}