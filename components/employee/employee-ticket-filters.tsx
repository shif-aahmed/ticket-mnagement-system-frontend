'use client';

import React from 'react';
import { TicketPriority, TicketStatus, TicketType } from '@/types/ticket';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { XIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { TICKET_TYPES } from '@/lib/mock-tickets-data';

export type EmployeeTabValue = 'all' | 'open' | 'in_progress' | 'pending' | 'resolved';
export type EmployeeScopeValue = 'all' | 'submitted' | 'assigned';

export interface EmployeeTicketFiltersProps {
  search: string;
  tab: EmployeeTabValue;
  status: TicketStatus | 'all';
  priority: TicketPriority | 'all';
  scope?: EmployeeScopeValue;
  type?: TicketType | 'all';
  onSearchChange: (search: string) => void;
  onTabChange: (tab: EmployeeTabValue) => void;
  onStatusChange: (status: TicketStatus | 'all') => void;
  onPriorityChange: (priority: TicketPriority | 'all') => void;
  onScopeChange?: (scope: EmployeeScopeValue) => void;
  onTypeChange?: (type: TicketType | 'all') => void;
  onClearFilters: () => void;
  tabCounts: Record<EmployeeTabValue, number>;
  resultCount: number;
  totalCount: number;
  className?: string;
}

const statusOptions: { value: TicketStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
];

const priorityOptions: { value: TicketPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const tabsConfig: { value: EmployeeTabValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
];

export const EmployeeTicketFilters = ({
  search,
  tab,
  status,
  priority,
  scope = 'all',
  type = 'all',
  onSearchChange,
  onTabChange,
  onStatusChange,
  onPriorityChange,
  onScopeChange,
  onTypeChange,
  onClearFilters,
  tabCounts,
  resultCount,
  totalCount,
  className = '',
}: EmployeeTicketFiltersProps) => {
  const isFiltered =
    search.trim() !== '' ||
    tab !== 'all' ||
    status !== 'all' ||
    priority !== 'all' ||
    scope !== 'all' ||
    type !== 'all';

  return (
    <div className={cn('space-y-4', className)} aria-label="Employee ticket filters and tabs">
      {/* 1. Status Views / Tabs Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E5EDE9] scrollbar-none">
        {tabsConfig.map((t) => {
          const isActive = tab === t.value;
          const count = tabCounts[t.value] || 0;

          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onTabChange(t.value)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-[#063F3F] text-white shadow-xs'
                  : 'text-[#6B7F7F] hover:text-[#102A2A] hover:bg-[#F3F9F7]'
              )}
            >
              <span>{t.label}</span>
              <span
                className={cn(
                  'inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#E5EDE9] text-[#102A2A]'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Search & Dropdown Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search by ID or Subject */}
        <div className="w-full lg:w-72">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            placeholder="Search by ticket ID or subject..."
            showShortcut={false}
            aria-label="Search my tickets by ID or subject"
          />
        </div>

        {/* Filter Dropdowns, Counter & Clear Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Scope Selector */}
          {onScopeChange && (
            <Select
              aria-label="Filter by Scope"
              value={scope}
              onChange={(e) => onScopeChange(e.target.value as EmployeeScopeValue)}
              containerClassName="w-auto"
              className="text-xs md:text-sm font-medium min-w-[130px]"
            >
              <option value="all">All My Work</option>
              <option value="submitted">Submitted by Me</option>
              <option value="assigned">Assigned to Me</option>
            </Select>
          )}

          {/* Type Filter */}
          {onTypeChange && (
            <Select
              aria-label="Filter by Type"
              value={type}
              onChange={(e) => onTypeChange(e.target.value as TicketType | 'all')}
              containerClassName="w-auto"
              className="text-xs md:text-sm font-medium min-w-[120px]"
            >
              <option value="all">All Types</option>
              {TICKET_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          )}

          {/* Status Filter */}
          <Select
            aria-label="Filter by Status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TicketStatus | 'all')}
            containerClassName="w-auto"
            className="text-xs md:text-sm font-medium min-w-[120px]"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          {/* Priority Filter */}
          <Select
            aria-label="Filter by Priority"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as TicketPriority | 'all')}
            containerClassName="w-auto"
            className="text-xs md:text-sm font-medium min-w-[120px]"
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          {/* Result Counter */}
          <span className="text-xs text-[#6B7F7F] px-2.5 py-1.5 bg-[#F3F9F7] rounded-md border border-[#E5EDE9] select-none">
            Showing <strong className="text-[#102A2A]">{resultCount}</strong> of{' '}
            {totalCount}
          </span>

          {/* Clear Filters Button */}
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              leftIcon={<XIcon size={14} />}
              className="text-[#6B7F7F] hover:text-[#EF4444] text-xs h-9"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
