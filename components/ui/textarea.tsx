import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = '',
      id,
      label,
      helperText,
      errorMessage,
      disabled,
      rows = 5,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const hasError = Boolean(errorMessage);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-[#102A2A] select-none"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError || helperText ? `${textareaId}-desc` : undefined}
          className={cn(
            'w-full rounded-md bg-white border px-3 py-2 text-sm text-[#102A2A] placeholder:text-[#6B7F7F]/60 transition-colors outline-none resize-y',
            hasError
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
              : 'border-[#E5EDE9] hover:border-[#CBD5E1] focus:border-[#063F3F] focus:ring-2 focus:ring-[#063F3F]/10',
            disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed border-[#E5EDE9]',
            className
          )}
          {...props}
        />
        {errorMessage ? (
          <p id={`${textareaId}-desc`} className="text-xs text-[#EF4444] font-medium">{errorMessage}</p>
        ) : helperText ? (
          <p id={`${textareaId}-desc`} className="text-xs text-[#6B7F7F]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
