'use client';

import React from 'react';
import { UserFiltersState, AdminUserRole, AdminUserStatus } from '@/types/user';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { XIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface UserFiltersProps {
  filters: UserFiltersState;
  onFilterChange: (filters: UserFiltersState) => void;
  onClearFilters: () => void;
  className?: string;
}

const roleOptions: { value: AdminUserRole | 'all'; label: string }[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'agent', label: 'Agent' },
  { value: 'employee', label: 'Employee' },
];

const statusOptions: { value: AdminUserStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const UserFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  className = '',
}: UserFiltersProps) => {
  const isFiltered =
    filters.search.trim() !== '' ||
    filters.role !== 'all' ||
    filters.status !== 'all';

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3',
        className
      )}
      aria-label="User filtering options"
    >
      {/* Search Input */}
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
          placeholder="Search users by name or email..."
          showShortcut={false}
          aria-label="Search users by name or email"
        />
      </div>

      {/* Filter Dropdowns & Clear Action */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Role Filter */}
        <Select
          aria-label="Filter by Role"
          value={filters.role}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              role: e.target.value as AdminUserRole | 'all',
            })
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium min-w-[150px]"
        >
          {roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
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
              status: e.target.value as AdminUserStatus | 'all',
            })
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium min-w-[140px]"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

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
