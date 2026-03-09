import { Sparkles, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">Postiva</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              A modern blogging platform for creators. Share your ideas, connect with readers,
              and build your audience.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/feed" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Feed
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Write
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Postiva. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
