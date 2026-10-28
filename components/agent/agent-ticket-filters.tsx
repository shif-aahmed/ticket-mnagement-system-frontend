'use client';

import React from 'react';
import { TicketPriority, TicketStatus } from '@/types/ticket';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { XIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface AgentTicketFiltersProps {
  search: string;
  status: TicketStatus | 'all';
  priority: TicketPriority | 'all';
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TicketStatus | 'all') => void;
  onPriorityChange: (priority: TicketPriority | 'all') => void;
  onClearFilters: () => void;
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
  { value: 'closed', label: 'Closed' },
];

const priorityOptions: { value: TicketPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const AgentTicketFilters = ({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onClearFilters,
  resultCount,
  totalCount,
  className = '',
}: AgentTicketFiltersProps) => {
  const isFiltered =
    search.trim() !== '' || status !== 'all' || priority !== 'all';

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3',
        className
      )}
      aria-label="Agent ticket queue filtering"
    >
      {/* Search Input */}
      <div className="w-full lg:w-80">
        <SearchInput
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          placeholder="Search ID, subject, requester..."
          showShortcut={false}
          aria-label="Search assigned tickets by ID, subject, or requester"
        />
      </div>

      {/* Filter Dropdowns, Counter & Clear Action */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Filter */}
        <Select
          aria-label="Filter by Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TicketStatus | 'all')}
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium min-w-[140px]"
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
          onChange={(e) =>
            onPriorityChange(e.target.value as TicketPriority | 'all')
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium min-w-[140px]"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {/* Result Counter Pill */}
        <span className="text-xs text-[#6B7F7F] px-2 py-1 bg-[#F3F9F7] rounded-md border border-[#E5EDE9] select-none">
          Showing <strong className="text-[#102A2A]">{resultCount}</strong> of{' '}
          {totalCount}
        </span>

        {/* Clear Filters Action */}
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
  );
};
