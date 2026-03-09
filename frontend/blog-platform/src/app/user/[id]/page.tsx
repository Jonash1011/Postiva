'use client';

import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, User as UserIcon } from 'lucide-react';
import { blogService } from '@/services/blogService';
import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Blog } from '@/types/blog';

interface UserProfile {
    id: string;
    email: string;
    username?: string;
    bio?: string;
    profileImageUrl?: string;
    createdAt: string;
    blogs: Blog[];
}

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await blogService.getUserProfile(id);
                setProfile(data);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <Loading />;

    if (error || !profile) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-2">User not found</h2>
                <p className="text-muted-foreground mb-6">
                    {error || 'The user you are looking for does not exist.'}
                </p>
                <Link href="/feed">
                    <Button variant="outline">Back to Feed</Button>
                </Link>
            </div>
        );
    }

    const displayName = profile.username || profile.email;
    const blogCount = profile.blogs.length;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 mb-10 overflow-hidden"
            >
                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <Avatar email={profile.email} imageUrl={profile.profileImageUrl} size="lg" className="!h-20 !w-20 !text-2xl" />

                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                            {displayName}
                        </h1>

                        {profile.bio && (
                            <p className="text-muted-foreground leading-relaxed max-w-xl mb-4">
                                {profile.bio}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                Joined {formatDate(profile.createdAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="h-4 w-4" />
                                {blogCount} {blogCount === 1 ? 'post' : 'posts'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Published Blogs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Posts by {displayName}</h2>
                        <p className="text-sm text-muted-foreground">
                            {blogCount === 0 ? 'No published posts yet' : `${blogCount} published ${blogCount === 1 ? 'post' : 'posts'}`}
                        </p>
                    </div>
                </div>

                {blogCount > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profile.blogs.map((blog, i) => (
                            <BlogCard key={blog.id} blog={blog} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 rounded-2xl border border-border bg-card/30">
                        <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">This user hasn&apos;t published any posts yet.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
