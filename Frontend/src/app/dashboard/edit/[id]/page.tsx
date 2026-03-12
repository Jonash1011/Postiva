'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBlogs } from '@/hooks/useBlogs';
import { useToast } from '@/hooks/useToast';
import { blogService } from '@/services/blogService';
import BlogEditor from '@/components/BlogEditor';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Blog } from '@/types/blog';
import Link from 'next/link';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { updateBlog } = useBlogs();
  const { success: showSuccess } = useToast();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogService.getBlogById(id);
        setBlog(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchBlog();
    }
  }, [id, isAuthenticated]);

  const handleSubmit = async (data: any) => {
    await updateBlog(id, data);
    showSuccess('Blog updated successfully!');
    router.push('/dashboard');
  };

  if (authLoading || loading) return <Loading />;
  if (!isAuthenticated) return null;

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Blog not found</h2>
        <p className="text-muted-foreground mb-6">
          {error || 'The blog you are looking for does not exist.'}
        </p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <Edit3 className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Edit Blog</h1>
            <p className="text-sm text-muted-foreground">
              Update your blog post
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <BlogEditor
              initialData={{
                title: blog.title,
                content: blog.content,
                coverImage: blog.coverImage,
                isPublished: blog.isPublished,
              }}
              onSubmit={handleSubmit}
              submitText="Update Blog"
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}