'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  PenSquare,
  Users,
  TrendingUp,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Zap,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: PenSquare,
    title: 'Beautiful Editor',
    description: 'Write with a clean, distraction-free markdown editor.',
  },
  {
    icon: Users,
    title: 'Build Community',
    description: 'Connect with readers and grow your audience.',
  },
  {
    icon: TrendingUp,
    title: 'Track Engagement',
    description: 'See likes, comments, and reading metrics.',
  },
  {
    icon: Heart,
    title: 'Like & Comment',
    description: 'Engage with content you love.',
  },
];

const stats = [
  { label: 'Active Writers', value: '2K+' },
  { label: 'Stories Published', value: '10K+' },
  { label: 'Monthly Readers', value: '50K+' },
];

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, login, register } = useAuth();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Auth form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authMode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await login({ email, password });
      } else {
        await register({ email, password });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'response' in err
            ? String((err as { response?: { data?: { message?: string } } }).response?.data?.message || (authMode === 'login' ? 'Invalid credentials' : 'Registration failed'))
            : authMode === 'login' ? 'Invalid credentials' : 'Registration failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render landing if authenticated (will redirect)
  if (authLoading) return null;
  if (isAuthenticated) return null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-secondary/12 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-accent/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-10rem)]">
          {/* ===== LEFT SIDE — App Details & Design ===== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-medium text-primary">Welcome to Postiva</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-5">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
              >
                Write, Share &{' '}
                <span className="gradient-text">Inspire</span>
                <br />
                the World
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-muted-foreground max-w-lg leading-relaxed"
              >
                Share your thoughts, connect with readers, and explore amazing content
                from writers around the world. Your words deserve a beautiful home.
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="group flex items-start gap-3 p-3 rounded-xl hover:bg-card/50 transition-colors duration-300"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{feature.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex gap-8 pt-4 border-t border-border/40"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Explore link for non-auth */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Link href="/feed">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground group p-0">
                  <BookOpen className="h-4 w-4" />
                  Or browse blogs without signing in
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* ===== RIGHT SIDE — Login / Sign Up ===== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            <Card className="glass border-border/40 shadow-2xl shadow-black/20">
              <CardContent className="p-6 sm:p-8">
                {/* Tab Switcher */}
                <div className="flex rounded-xl bg-background/60 border border-border/40 p-1 mb-8">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); resetForm(); }}
                    className={cn(
                      'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300',
                      authMode === 'login'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); resetForm(); }}
                    className={cn(
                      'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300',
                      authMode === 'register'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Welcome text */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={authMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6"
                  >
                    <h2 className="text-xl font-bold">
                      {authMode === 'login' ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {authMode === 'login'
                        ? 'Log in to access your dashboard'
                        : 'Join the community and start writing'}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm mb-6"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                      className="h-11"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      Password
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                    {authMode === 'login' && (
                      <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {authMode === 'register' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                          Confirm Password
                        </label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          disabled={isLoading}
                          className="h-11"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4 animate-pulse" />
                        {authMode === 'login' ? 'Logging in...' : 'Creating account...'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {authMode === 'login' ? 'Log In' : 'Sign Up'}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground">
                      {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); resetForm(); }}
                >
                  {authMode === 'login' ? 'Create an Account' : 'Log In Instead'}
                </Button>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground/60"
            >
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Secure
              </span>
              <span>•</span>
              <span>Free Forever</span>
              <span>•</span>
              <span>No Ads</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}