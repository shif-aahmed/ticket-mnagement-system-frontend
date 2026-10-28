'use client';

import React from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XIcon } from '@/components/ui/icons';
import {
  ReportsFiltersState,
  ReportsDateRange,
} from '@/types/reports';
import {
  DATE_RANGE_OPTIONS,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  TYPE_OPTIONS,
} from '@/lib/reports-analytics';
import { TICKET_DEPARTMENTS } from '@/lib/mock-tickets-data';

export interface ReportsFiltersProps {
  filters: ReportsFiltersState;
  onFilterChange: (filters: ReportsFiltersState) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
  categories?: { id: string; name: string }[];
}

export const ReportsFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalCount,
  categories = [],
}: ReportsFiltersProps) => {
  const isFiltered =
    filters.dateRange !== 'all' ||
    filters.department !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.type !== 'all' ||
    filters.category !== 'all';

  const handleChange = <K extends keyof ReportsFiltersState>(
    field: K,
    val: ReportsFiltersState[K]
  ) => {
    onFilterChange({ ...filters, [field]: val });
  };

  return (
    <Card className="p-4 border-[#E5EDE9] space-y-3 bg-white text-left">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#102A2A]">
            Report Filters & Segmentation
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F3F9F7] text-[#063F3F] border border-[#E5EDE9]">
            {filteredCount} of {totalCount} tickets
          </span>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<XIcon size={14} />}
            onClick={onResetFilters}
            className="text-xs text-[#DC2626] hover:bg-[#FEE2E2]/60 h-7 px-2"
          >
            Reset all filters
          </Button>
        )}
      </div>

      {/* Filter Dropdown Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {/* Date Range */}
        <Select
          id="reports-filter-date-range"
          label="Date Range"
          value={filters.dateRange}
          onChange={(e) => handleChange('dateRange', e.target.value as ReportsDateRange)}
        >
          {DATE_RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {/* Department */}
        <Select
          id="reports-filter-department"
          label="Department / Team"
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

        {/* Status */}
        <Select
          id="reports-filter-status"
          label="Status"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {/* Priority */}
        <Select
          id="reports-filter-priority"
          label="Priority"
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {/* Type */}
        <Select
          id="reports-filter-type"
          label="Ticket Type"
          value={filters.type}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        {/* Category */}
        <Select
          id="reports-filter-category"
          label="Category"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
    </Card>
  );
};
