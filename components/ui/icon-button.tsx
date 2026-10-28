import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type IconButtonVariant = 'ghost' | 'outline' | 'filled' | 'subtle';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  'aria-label': string; // Enforce accessibility
}

const variantStyles: Record<IconButtonVariant, string> = {
  ghost: 'bg-transparent text-[#6B7F7F] hover:text-[#102A2A] hover:bg-[#E2ECE9]/60',
  outline: 'bg-white text-[#102A2A] border border-[#E5EDE9] hover:bg-[#F3F9F7] hover:border-[#CBD5E1]',
  filled: 'bg-[#063F3F] text-white hover:bg-[#064747]',
  subtle: 'bg-[#DDF4E9] text-[#063F3F] hover:bg-[#bcf0d7]',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8 rounded-md text-xs',
  md: 'h-9 w-9 rounded-md text-sm',
  lg: 'h-10 w-10 rounded-lg text-base',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className = '',
      variant = 'ghost',
      size = 'md',
      disabled = false,
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center transition-colors outline-none cursor-pointer shrink-0 select-none focus-visible:ring-2 focus-visible:ring-[#063F3F]/30',
          variantStyles[variant],
          sizeStyles[size],
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
