'use client';

import { useState, useEffect } from 'react';
import { blogService } from '@/services/blogService';
import { Blog, CreateBlogDto, UpdateBlogDto, FeedResponse } from '@/types/blog';

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getMyBlogs();
      setBlogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (data: CreateBlogDto): Promise<Blog> => {
    const newBlog = await blogService.createBlog(data);
    setBlogs((prev) => [newBlog, ...prev]);
    return newBlog;
  };

  const updateBlog = async (id: string, data: UpdateBlogDto): Promise<Blog> => {
    const updatedBlog = await blogService.updateBlog(id, data);
    setBlogs((prev) =>
      prev.map((blog) => (blog.id === id ? updatedBlog : blog))
    );
    return updatedBlog;
  };

  const deleteBlog = async (id: string): Promise<void> => {
    await blogService.deleteBlog(id);
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
  };

  return {
    blogs,
    loading,
    error,
    fetchMyBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}

export function useFeed(initialPage: number = 1) {
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async (page: number = initialPage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getPublicFeed(page, 10);
      setFeed(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(initialPage);
  }, [initialPage]);

  return {
    feed,
    loading,
    error,
    fetchFeed,
  };
}

export function useBlog(slug: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await blogService.getBlogBySlug(slug);
        setBlog(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  return {
    blog,
    setBlog,
    loading,
    error,
  };
}