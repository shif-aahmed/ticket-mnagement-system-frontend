'use client';

import React from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XIcon, FilterIcon } from '@/components/ui/icons';
import { CalendarFiltersState } from '@/types/calendar';
import {
  TICKET_DEPARTMENTS,
  TICKET_TYPES,
} from '@/lib/mock-tickets-data';

export interface CalendarFiltersProps {
  filters: CalendarFiltersState;
  onFilterChange: (filters: CalendarFiltersState) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalScheduledCount: number;
  assignees?: { id: string; name: string }[];
}

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const CalendarFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalScheduledCount,
  assignees = [],
}: CalendarFiltersProps) => {
  const isFiltered =
    filters.department !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.type !== 'all' ||
    filters.assignee !== 'all';

  const handleChange = <K extends keyof CalendarFiltersState>(
    field: K,
    val: CalendarFiltersState[K]
  ) => {
    onFilterChange({ ...filters, [field]: val });
  };

  return (
    <Card className="p-4 border-[#E5EDE9] space-y-3 bg-white text-left">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FilterIcon size={16} className="text-[#064747]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#102A2A]">
            Calendar & Deadline Filters
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F3F9F7] text-[#063F3F] border border-[#E5EDE9]">
            {filteredCount} of {totalScheduledCount} scheduled
          </span>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-xs text-[#DC2626] hover:bg-[#FEE2E2]/50 hover:text-[#B91C1C] h-7 px-2"
          >
            <XIcon size={14} className="mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {/* Department */}
        <div>
          <label
            htmlFor="calendar-dept"
            className="block text-[11px] font-semibold text-[#4A5D5D] mb-1 uppercase tracking-wider"
          >
            Department
          </label>
          <Select
            id="calendar-dept"
            value={filters.department}
            onChange={(e) => handleChange('department', e.target.value)}
          >
            <option value="all">All Departments</option>
            {TICKET_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </Select>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="calendar-status"
            className="block text-[11px] font-semibold text-[#4A5D5D] mb-1 uppercase tracking-wider"
          >
            Status
          </label>
          <Select
            id="calendar-status"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value as CalendarFiltersState['status'])}
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Priority */}
        <div>
          <label
            htmlFor="calendar-priority"
            className="block text-[11px] font-semibold text-[#4A5D5D] mb-1 uppercase tracking-wider"
          >
            Priority
          </label>
          <Select
            id="calendar-priority"
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value as CalendarFiltersState['priority'])}
          >
            <option value="all">All Priorities</option>
            {PRIORITY_OPTIONS.map((pr) => (
              <option key={pr.value} value={pr.value}>
                {pr.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Ticket Type */}
        <div>
          <label
            htmlFor="calendar-type"
            className="block text-[11px] font-semibold text-[#4A5D5D] mb-1 uppercase tracking-wider"
          >
            Ticket Type
          </label>
          <Select
            id="calendar-type"
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value as CalendarFiltersState['type'])}
          >
            <option value="all">All Types</option>
            {TICKET_TYPES.map((tp) => (
              <option key={tp.value} value={tp.value}>
                {tp.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Assignee */}
        <div>
          <label
            htmlFor="calendar-assignee"
            className="block text-[11px] font-semibold text-[#4A5D5D] mb-1 uppercase tracking-wider"
          >
            Assignee
          </label>
          <Select
            id="calendar-assignee"
            value={filters.assignee}
            onChange={(e) => handleChange('assignee', e.target.value)}
          >
            <option value="all">All Assignees</option>
            {assignees.map((asg) => (
              <option key={asg.id} value={asg.name}>
                {asg.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </Card>
  );
};
