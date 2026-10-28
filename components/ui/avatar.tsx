import React from 'react';
import { cn } from '@/lib/utils';
import { UserStatus } from '@/types/user';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  name: string;
  fallback?: string;
  size?: AvatarSize;
  status?: UserStatus;
  className?: string;
}

const sizeConfig: Record<AvatarSize, { box: string; text: string; statusDot: string }> = {
  xs: { box: 'h-6 w-6', text: 'text-[10px]', statusDot: 'h-1.5 w-1.5 right-0 bottom-0 ring-1' },
  sm: { box: 'h-8 w-8', text: 'text-xs font-medium', statusDot: 'h-2 w-2 right-0 bottom-0 ring-1' },
  md: { box: 'h-9 w-9', text: 'text-xs font-semibold', statusDot: 'h-2.5 w-2.5 right-0 bottom-0 ring-1.5' },
  lg: { box: 'h-10 w-10', text: 'text-sm font-semibold', statusDot: 'h-2.5 w-2.5 right-0 bottom-0 ring-2' },
  xl: { box: 'h-12 w-12', text: 'text-base font-semibold', statusDot: 'h-3 w-3 right-0.5 bottom-0.5 ring-2' },
};

const statusColors: Record<UserStatus, string> = {
  online: 'bg-[#22C55E]',
  away: 'bg-[#F97316]',
  busy: 'bg-[#EF4444]',
  offline: 'bg-[#94A3B8]',
};

export const Avatar = ({
  src,
  name,
  fallback,
  size = 'md',
  status,
  className = '',
}: AvatarProps) => {
  const { box, text, statusDot } = sizeConfig[size];

  const getInitials = (n: string) => {
    if (fallback) return fallback;
    if (!n) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', box, className)}>
      <div
        className={cn(
          'h-full w-full rounded-full flex items-center justify-center overflow-hidden border border-[#E5EDE9] bg-[#063F3F] text-white',
          text
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute rounded-full ring-white',
            statusDot,
            statusColors[status]
          )}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
