'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, PenSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBlogs } from '@/hooks/useBlogs';
import { useToast } from '@/hooks/useToast';
import BlogEditor from '@/components/BlogEditor';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function CreateBlogPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { createBlog } = useBlogs();
  const { success: showSuccess } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (data: any) => {
    await createBlog(data);
    showSuccess('Blog published successfully!');
    router.push('/dashboard');
  };

  if (authLoading) return <Loading />;
  if (!isAuthenticated) return null;

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
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <PenSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create New Blog</h1>
            <p className="text-sm text-muted-foreground">
              Share your thoughts with the world
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <BlogEditor onSubmit={handleSubmit} submitText="Publish Blog" />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}