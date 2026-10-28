import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { SearchIcon, XIcon } from '@/components/ui/icons';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  showShortcut?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className = '',
      value,
      onChange,
      onClear,
      placeholder = 'Search tickets, users, or knowledge base...',
      showShortcut = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && value !== '';

    return (
      <div className={cn('relative flex items-center w-full min-w-[200px]', className)}>
        <div className="absolute left-3 pointer-events-none flex items-center justify-center text-[#6B7F7F]">
          <SearchIcon size={16} />
        </div>
        <input
          ref={ref}
          type="search"
          aria-label={props['aria-label'] || (typeof placeholder === 'string' ? placeholder : 'Search')}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'w-full h-9 pl-9 pr-14 text-xs md:text-sm bg-white border border-[#E5EDE9] rounded-md text-[#102A2A] placeholder:text-[#6B7F7F]/70',
            'transition-colors outline-none hover:border-[#CBD5E1] focus:border-[#063F3F] focus:ring-2 focus:ring-[#063F3F]/10',
            disabled && 'bg-slate-50 cursor-not-allowed opacity-60'
          )}
          {...props}
        />
        <div className="absolute right-2.5 flex items-center gap-1">
          {hasValue && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-[#6B7F7F] hover:text-[#102A2A] rounded-sm transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <XIcon size={14} />
            </button>
          )}
          {showShortcut && !hasValue && (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#6B7F7F] bg-[#F3F9F7] border border-[#E5EDE9] rounded">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
