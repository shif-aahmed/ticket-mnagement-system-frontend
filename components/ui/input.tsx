import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      id,
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hasError = Boolean(errorMessage);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#102A2A] select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none flex items-center justify-center text-[#6B7F7F]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError || helperText ? `${inputId}-desc` : undefined}
            className={cn(
              'w-full h-9 rounded-md bg-white border px-3 text-sm text-[#102A2A] placeholder:text-[#6B7F7F]/60 transition-colors outline-none',
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              hasError
                ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
                : 'border-[#E5EDE9] hover:border-[#CBD5E1] focus:border-[#063F3F] focus:ring-2 focus:ring-[#063F3F]/10',
              disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed border-[#E5EDE9]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center justify-center text-[#6B7F7F]">
              {rightIcon}
            </div>
          )}
        </div>
        {errorMessage ? (
          <p id={`${inputId}-desc`} className="text-xs text-[#EF4444] font-medium">{errorMessage}</p>
        ) : helperText ? (
          <p id={`${inputId}-desc`} className="text-xs text-[#6B7F7F]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
