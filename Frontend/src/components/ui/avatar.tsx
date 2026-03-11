import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  email: string;
  imageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export default function Avatar({ email, imageUrl, size = 'md', className }: AvatarProps) {
  const initials = getInitials(email);

  if (imageUrl) {
    return (
      <div
        className={cn(
          'relative rounded-full overflow-hidden shrink-0',
          sizeClasses[size],
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={email}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-semibold text-white shrink-0',
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
