'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/ui/toaster';
import { authUtils } from '@/lib/auth';

// Pages where Navbar and Footer are hidden (landing / auth pages)
const BARE_PAGES = ['/', '/login', '/register', '/profile-setup'];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isBare = BARE_PAGES.includes(pathname);

  useEffect(() => {
    const user = authUtils.getUser();
    // Redirect authenticated users with incomplete profiles to profile-setup
    if (user && !user.profileComplete && pathname !== '/profile-setup' && pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
      router.push('/profile-setup');
    }
  }, [pathname, router]);

  if (isBare) {
    return (
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
