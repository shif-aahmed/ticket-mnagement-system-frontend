import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'urgent' | 'active' | 'neutral' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  default: {
    container: 'bg-[#DDF4E9] text-[#063F3F] border-[#BBF7D0]',
    dot: 'bg-[#063F3F]',
  },
  success: {
    container: 'bg-[#DDF4E9] text-[#15803D] border-[#BBF7D0]',
    dot: 'bg-[#22C55E]',
  },
  warning: {
    container: 'bg-[#FFEDD5] text-[#C2410C] border-[#FED7AA]',
    dot: 'bg-[#F97316]',
  },
  urgent: {
    container: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]',
    dot: 'bg-[#EF4444]',
  },
  active: {
    container: 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]',
    dot: 'bg-[#0D9488]',
  },
  neutral: {
    container: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
    dot: 'bg-[#64748B]',
  },
  outline: {
    container: 'bg-transparent text-[#102A2A] border-[#CBD5E1]',
    dot: 'bg-[#6B7F7F]',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 font-medium gap-1.5',
  md: 'text-xs px-2.5 py-1 font-medium gap-1.5',
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
  ...props
}: BadgeProps) => {
  const { container, dot: dotBg } = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border leading-none shrink-0 select-none font-medium',
        container,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotBg)} />}
      <span>{children}</span>
    </span>
  );
};
