import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#063F3F] text-white hover:bg-[#064747] active:bg-[#053333] shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[#063F3F]/30',
  accent:
    'bg-[#22C55E] text-[#063F3F] font-semibold hover:bg-[#16A34A] hover:text-white active:bg-[#15803D] shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[#22C55E]/40',
  secondary:
    'bg-white text-[#102A2A] border border-[#E5EDE9] hover:bg-[#F3F9F7] hover:border-[#CBD5E1] shadow-xs focus-visible:ring-2 focus-visible:ring-[#063F3F]/20',
  outline:
    'bg-transparent text-[#063F3F] border border-[#063F3F]/20 hover:bg-[#DDF4E9]/50 focus-visible:ring-2 focus-visible:ring-[#063F3F]/20',
  ghost:
    'bg-transparent text-[#6B7F7F] hover:text-[#102A2A] hover:bg-[#E2ECE9]/60 focus-visible:ring-2 focus-visible:ring-[#063F3F]/20',
  danger:
    'bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] shadow-xs border border-transparent focus-visible:ring-2 focus-visible:ring-[#EF4444]/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-2.5 text-xs rounded-md gap-1.5',
  md: 'h-9 px-3.5 text-sm rounded-md gap-2',
  lg: 'h-10 px-4 text-base rounded-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors outline-none select-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && 'opacity-60 cursor-not-allowed pointer-events-none shadow-none',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
