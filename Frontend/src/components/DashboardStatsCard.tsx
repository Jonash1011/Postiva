'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive';
  index?: number;
}

const colorMap = {
  primary: 'from-primary/20 to-primary/5 text-primary border-primary/20',
  secondary: 'from-secondary/20 to-secondary/5 text-secondary border-secondary/20',
  accent: 'from-accent/20 to-accent/5 text-accent border-accent/20',
  destructive: 'from-destructive/20 to-destructive/5 text-destructive border-destructive/20',
};

export default function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  index = 0,
}: DashboardStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        'relative rounded-xl border bg-gradient-to-br p-6 overflow-hidden',
        colorMap[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-accent mt-1">{trend}</p>
          )}
        </div>
        <div className="h-10 w-10 rounded-lg bg-card/50 border border-border/50 flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
