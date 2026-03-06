'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Type, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { getReadingTime } from '@/lib/utils';

interface BlogEditorProps {
  initialData?: {
    title: string;
    content: string;
    isPublished: boolean;
  };
  onSubmit: (data: { title: string; content: string; isPublished: boolean }) => Promise<void>;
  submitText?: string;
}

export default function BlogEditor({
  initialData,
  onSubmit,
  submitText = 'Publish',
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = getReadingTime(content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ title, content, isPublished });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Type className="h-4 w-4 text-muted-foreground" />
          Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="An amazing blog title..."
          className="text-lg h-12"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <AlignLeft className="h-4 w-4 text-muted-foreground" />
            Content
          </label>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog content here..."
          className="min-h-[300px] text-base leading-relaxed"
          required
        />
      </div>

      <Card className="bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPublished ? (
                <Eye className="h-4 w-4 text-accent" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isPublished ? 'Published' : 'Draft'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPublished
                    ? 'Visible to everyone in the feed'
                    : 'Only visible to you'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                isPublished ? 'bg-accent' : 'bg-border'
              }`}
            >
              <motion.div
                animate={{ x: isPublished ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          disabled={loading}
        >
          {loading ? 'Saving...' : submitText}
        </Button>
      </div>
    </form>
  );
}
