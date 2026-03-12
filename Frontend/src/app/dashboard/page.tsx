'use client';

import { useEffect, useState, useRef } from 'react';
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
  Settings,
  X,
  Camera,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBlogs } from '@/hooks/useBlogs';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/services/authService';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import DashboardStatsCard from '@/components/DashboardStatsCard';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate, getErrorMessage } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user, refreshUser } = useAuth();
  const { blogs, loading, error, fetchMyBlogs, deleteBlog } = useBlogs();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
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
        showSuccess('Blog deleted successfully');
      } catch (err: unknown) {
        showError(getErrorMessage(err, 'Failed to delete blog'));
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
          <Avatar email={user?.email || ''} imageUrl={user?.profileImageUrl} size="lg" />
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.username || user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowEditProfile(true)}
          >
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
          <Link href="/dashboard/create">
            <Button variant="gradient" className="gap-2">
              <PenSquare className="h-4 w-4" />
              New Blog
            </Button>
          </Link>
        </div>
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
      {showEditProfile && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSaved={async () => {
            await refreshUser();
            setShowEditProfile(false);
          }}
        />
      )}
    </div>
  );
}

function EditProfileModal({
  user,
  onClose,
  onSaved,
}: {
  user: NonNullable<ReturnType<typeof import('@/hooks/useAuth').useAuth>['user']>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [username, setUsername] = useState(user.username || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
  );
  const [phoneNumber, setPhoneNumber] = useState(
    user.phoneNumber ? user.phoneNumber.replace('+91', '') : ''
  );
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    user.profileImageUrl || null
  );
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success: showSuccess, error: showError } = useToast();

  const canChangeUsername = (() => {
    if (!user.usernameChangedAt) return true;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    return Date.now() - new Date(user.usernameChangedAt).getTime() >= threeDaysMs;
  })();

  const usernameNextChangeDate = user.usernameChangedAt
    ? new Date(new Date(user.usernameChangedAt).getTime() + 3 * 24 * 60 * 60 * 1000)
    : null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('Image must be less than 5MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data: Record<string, string> = {};

      if (username !== user.username && username.trim()) {
        data.username = username;
      }
      if (dateOfBirth && dateOfBirth !== (user.dateOfBirth?.split('T')[0] || '')) {
        data.dateOfBirth = new Date(dateOfBirth).toISOString();
      }
      if (phoneNumber && '+91' + phoneNumber !== user.phoneNumber) {
        data.phoneNumber = '+91' + phoneNumber;
      }
      if (profileImage) {
        data.profileImageUrl = await authService.fileToBase64(profileImage);
      }

      if (Object.keys(data).length === 0) {
        showError('No changes to save');
        setSubmitting(false);
        return;
      }

      await authService.editProfile(data);
      showSuccess('Profile updated successfully!');
      setTimeout(onSaved, 800);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to update profile'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md"
      >
        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Edit Profile</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <AnimatePresence />

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Avatar
                    email={user.email}
                    imageUrl={profileImagePreview}
                    size="lg"
                    className="h-20 w-20 text-xl"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change photo
                </button>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!canChangeUsername}
                  placeholder="username"
                />
                {!canChangeUsername && usernameNextChangeDate && (
                  <p className="flex items-center gap-1 text-xs text-amber-500">
                    <AlertCircle className="h-3 w-3" />
                    Can change after {usernameNextChangeDate.toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-muted rounded-lg text-sm text-muted-foreground">
                    +91
                  </span>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhoneNumber(val);
                    }}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="gradient"
                className="w-full gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}