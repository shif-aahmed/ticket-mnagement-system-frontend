import React from 'react';
import { TicketFiltersState, TicketPriority, TicketStatus, TicketType } from '@/types/ticket';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { XIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { TICKET_TYPES, TICKET_DEPARTMENTS } from '@/lib/mock-tickets-data';

export interface TicketFiltersProps {
  filters: TicketFiltersState;
  onFilterChange: (filters: TicketFiltersState) => void;
  assignees: string[];
  onClearFilters: () => void;
  className?: string;
}

const statusOptions: { value: TicketStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'submitted', label: 'Submitted' },
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

export const TicketFilters = ({
  filters,
  onFilterChange,
  assignees,
  onClearFilters,
  className = '',
}: TicketFiltersProps) => {
  const isFiltered =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.assignee !== 'all' ||
    (filters.type !== undefined && filters.type !== 'all') ||
    (filters.department !== undefined && filters.department !== 'all');

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3',
        className
      )}
      aria-label="Ticket filtering options"
    >
      {/* Search Bar */}
      <div className="w-full lg:w-96">
        <SearchInput
          value={filters.search}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              search: e.target.value,
            })
          }
          onClear={() =>
            onFilterChange({
              ...filters,
              search: '',
            })
          }
          placeholder="Search tickets by ID, subject, or requester..."
          showShortcut={false}
          aria-label="Search tickets by ID, subject, or requester"
        />
      </div>

      {/* Filter Dropdowns & Clear Action */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Type Filter */}
        <Select
          aria-label="Filter by Type"
          value={filters.type || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              type: e.target.value as TicketType | 'all',
            })
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium"
        >
          <option value="all">All Types</option>
          {TICKET_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>

        {/* Department Filter */}
        <Select
          aria-label="Filter by Department"
          value={filters.department || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              department: e.target.value,
            })
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium"
        >
          <option value="all">All Departments</option>
          {TICKET_DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </Select>

        {/* Status Filter */}
        <Select
          aria-label="Filter by Status"
          value={filters.status}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value as TicketStatus | 'all',
            })
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium"
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
          value={filters.priority}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              priority: e.target.value as TicketPriority | 'all',
            })
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {/* Assignee Filter */}
        <Select
          aria-label="Filter by Assignee"
          value={filters.assignee}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              assignee: e.target.value,
            })
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium"
        >
          <option value="all">All Assignees</option>
          {assignees.map((assignee) => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </Select>

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
  );
};
