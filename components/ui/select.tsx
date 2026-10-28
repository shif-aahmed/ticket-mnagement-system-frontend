'use client';

import React, {
  forwardRef,
  useId,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, CheckIcon } from '@/components/ui/icons';

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  containerClassName?: string;
  placeholder?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = '',
      containerClassName = '',
      id,
      name,
      label,
      helperText,
      errorMessage,
      disabled,
      required,
      value,
      defaultValue,
      onChange,
      onBlur,
      placeholder,
      options,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const hasError = Boolean(errorMessage);

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement | null>(null);

    // Track internal value for uncontrolled or controlled syncing
    const [internalValue, setInternalValue] = useState<string>(() => {
      if (value !== undefined) return String(value);
      if (defaultValue !== undefined) return String(defaultValue);
      return '';
    });

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(String(value));
      }
    }, [value]);

    // Parse options from children if `options` prop is not passed directly
    const parsedOptions = useMemo<SelectOption[]>(() => {
      if (options && options.length > 0) {
        return options;
      }

      const list: SelectOption[] = [];

      const processNodes = (nodes: React.ReactNode) => {
        React.Children.forEach(nodes, (child) => {
          if (!child) return;
          if (React.isValidElement(child)) {
            if (child.type === 'option') {
              const p = child.props as {
                value?: string | number;
                children?: React.ReactNode;
                disabled?: boolean;
              };
              const optVal =
                p.value !== undefined
                  ? String(p.value)
                  : typeof p.children === 'string'
                  ? p.children
                  : '';
              list.push({
                value: optVal,
                label: p.children,
                disabled: Boolean(p.disabled),
              });
            } else if (
              child.props &&
              (child.props as { children?: React.ReactNode }).children
            ) {
              processNodes((child.props as { children?: React.ReactNode }).children);
            }
          }
        });
      };

      processNodes(children);
      return list;
    }, [children, options]);

    // Determine currently selected option
    const activeValue = value !== undefined ? String(value) : internalValue;
    const selectedOption = parsedOptions.find((opt) => opt.value === activeValue);

    // Keyboard navigation focus state
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Sync highlighted index when opening
    useEffect(() => {
      if (isOpen) {
        const idx = parsedOptions.findIndex((opt) => opt.value === activeValue);
        setHighlightedIndex(idx >= 0 ? idx : 0);
      }
    }, [isOpen, activeValue, parsedOptions]);

    const handleSelectOption = useCallback(
      (optVal: string) => {
        if (disabled) return;
        setInternalValue(optVal);
        setIsOpen(false);

        // Update hidden select if ref exists
        if (hiddenSelectRef.current) {
          hiddenSelectRef.current.value = optVal;
          const changeEvent = new Event('change', { bubbles: true });
          hiddenSelectRef.current.dispatchEvent(changeEvent);
        }

        // Fire custom onChange callback for React forms
        if (onChange) {
          const syntheticEvent = {
            target: { value: optVal, name: name || '', id: selectId },
            currentTarget: { value: optVal, name: name || '', id: selectId },
            persist: () => {},
            preventDefault: () => {},
            stopPropagation: () => {},
          } as unknown as React.ChangeEvent<HTMLSelectElement>;

          onChange(syntheticEvent);
        }

        triggerRef.current?.focus();
      },
      [disabled, name, onChange, selectId]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (!isOpen) {
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'Enter' ||
          e.key === ' '
        ) {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          while (next < parsedOptions.length && parsedOptions[next]?.disabled) {
            next++;
          }
          return next < parsedOptions.length ? next : prev;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && parsedOptions[next]?.disabled) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < parsedOptions.length) {
          const targetOpt = parsedOptions[highlightedIndex];
          if (targetOpt && !targetOpt.disabled) {
            handleSelectOption(targetOpt.value);
          }
        }
      } else if (e.key === 'Tab') {
        setIsOpen(false);
      }
    };

    // Label presentation
    const isPlaceholder = !selectedOption || selectedOption.value === '';
    const displayLabel = selectedOption
      ? selectedOption.label
      : placeholder || (parsedOptions[0] ? parsedOptions[0].label : '');

    return (
      <div
        ref={containerRef}
        className={cn(
          label || helperText || errorMessage ? 'space-y-1.5' : '',
          'text-left relative',
          containerClassName || 'w-full'
        )}
      >
        {label && (
          <label
            htmlFor={selectId}
            onClick={() => triggerRef.current?.focus()}
            className="block text-xs font-medium text-[#102A2A] select-none cursor-pointer"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Custom Styled Select Trigger Button */}
          <button
            ref={triggerRef}
            id={selectId}
            type="button"
            role="combobox"
            aria-label={props['aria-label'] || label || (typeof placeholder === 'string' ? placeholder : 'Select option')}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={`${selectId}-dropdown`}
            aria-invalid={hasError}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            onClick={() => {
              if (!disabled) setIsOpen((prev) => !prev);
            }}
            onBlur={
              onBlur
                ? (e) => {
                    (onBlur as unknown as React.FocusEventHandler<HTMLButtonElement>)(e);
                  }
                : undefined
            }
            className={cn(
              'w-full h-9 rounded-md bg-white border px-3 text-sm flex items-center justify-between gap-2 transition-colors outline-none cursor-pointer select-none text-left',
              hasError
                ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
                : isOpen
                ? 'border-[#063F3F] ring-2 ring-[#063F3F]/15 shadow-sm'
                : 'border-[#E5EDE9] hover:border-[#CBD5E1] hover:bg-[#FAFDFC] focus:border-[#063F3F] focus:ring-2 focus:ring-[#063F3F]/15',
              disabled &&
                'bg-slate-50 text-slate-400 cursor-not-allowed border-[#E5EDE9] hover:bg-slate-50 hover:border-[#E5EDE9]',
              className
            )}
          >
            <span
              className={cn(
                'truncate block flex-1 leading-tight',
                isPlaceholder
                  ? 'text-[#6B7F7F] font-normal'
                  : 'text-[#102A2A] font-medium'
              )}
            >
              {displayLabel}
            </span>
            <ChevronDownIcon
              size={16}
              className={cn(
                'text-[#6B7F7F] transition-transform duration-200 shrink-0',
                isOpen && 'rotate-180 text-[#063F3F]'
              )}
            />
          </button>

          {/* Hidden native select for form integration, refs, and accessibility */}
          <select
            ref={(node) => {
              hiddenSelectRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLSelectElement | null>).current =
                  node;
              }
            }}
            id={`${selectId}-native`}
            name={name}
            value={activeValue}
            disabled={disabled}
            required={required}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            onChange={() => { /* No-op: value is managed by handleSelectOption via the custom dropdown */ }}
            {...props}
          >
            {parsedOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {typeof opt.label === 'string' ? opt.label : opt.value}
              </option>
            ))}
          </select>

          {/* Custom Styled Opened Dropdown Menu */}
          {isOpen && (
            <div
              id={`${selectId}-dropdown`}
              role="listbox"
              tabIndex={-1}
              className={cn(
                'absolute left-0 top-[calc(100%+4px)] z-50 min-w-full bg-white border border-[#E5EDE9] rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto outline-none animate-in fade-in zoom-in-95 duration-100',
                containerClassName?.includes('w-auto') &&
                  'w-max min-w-[170px] max-w-sm'
              )}
            >
              {parsedOptions.length === 0 ? (
                <div className="px-3 py-2 text-xs text-[#6B7F7F] text-center">
                  No options available
                </div>
              ) : (
                parsedOptions.map((opt, idx) => {
                  const isSelected = opt.value === activeValue;
                  const isHighlighted = idx === highlightedIndex;
                  const isOptionPlaceholder = opt.value === '';

                  return (
                    <div
                      key={`${opt.value}-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        if (!opt.disabled) {
                          handleSelectOption(opt.value);
                        }
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={cn(
                        'relative flex items-center justify-between gap-2 px-3 py-2 text-xs md:text-sm cursor-pointer transition-colors text-left select-none rounded-md mx-1',
                        opt.disabled
                          ? 'opacity-40 cursor-not-allowed text-slate-400'
                          : isSelected
                          ? 'bg-[#E6F4F1] text-[#063F3F] font-medium'
                          : isHighlighted
                          ? 'bg-[#F3F9F7] text-[#063F3F]'
                          : 'text-[#102A2A] hover:bg-[#F3F9F7] hover:text-[#063F3F]',
                        isOptionPlaceholder && !isSelected && 'text-[#6B7F7F] italic'
                      )}
                    >
                      <span className="truncate flex-1">{opt.label}</span>
                      {isSelected && (
                        <CheckIcon
                          size={14}
                          className="text-[#22C55E] shrink-0 stroke-[2.5]"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {errorMessage ? (
          <p className="text-xs text-[#EF4444] font-medium">{errorMessage}</p>
        ) : helperText ? (
          <p className="text-xs text-[#6B7F7F]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
