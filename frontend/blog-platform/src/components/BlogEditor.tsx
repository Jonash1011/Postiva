'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Type, AlignLeft, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { getReadingTime, getErrorMessage } from '@/lib/utils';

interface BlogEditorProps {
  initialData?: {
    title: string;
    content: string;
    coverImage?: string;
    isPublished: boolean;
  };
  onSubmit: (data: { title: string; content: string; coverImage?: string; isPublished: boolean }) => Promise<void>;
  submitText?: string;
}

export default function BlogEditor({
  initialData,
  onSubmit,
  submitText = 'Publish',
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverImage, setCoverImage] = useState<string | undefined>(initialData?.coverImage);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: showError } = useToast();

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = getReadingTime(content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showError('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ title, content, coverImage, isPublished });
    } catch (err: unknown) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError('Image must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setCoverImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ImagePlus className="h-4 w-4 text-muted-foreground" />
          Cover Image
          <span className="text-xs text-muted-foreground font-normal">(optional, max 5MB)</span>
        </label>
        {coverImage ? (
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img
              src={coverImage}
              alt="Cover preview"
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <ImagePlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to upload a cover image</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
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
