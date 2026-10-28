import React from 'react';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { XIcon } from '@/components/ui/icons';
import { CategoryFiltersState, CategoryStatus } from '@/types/category';
import { TICKET_DEPARTMENTS } from '@/lib/mock-tickets-data';
import { cn } from '@/lib/utils';

export interface CategoryFiltersProps {
  filters: CategoryFiltersState;
  onFilterChange: (filters: CategoryFiltersState) => void;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
  className?: string;
}

const statusOptions: { value: CategoryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const CategoryFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
  totalCount,
  className = '',
}: CategoryFiltersProps) => {
  const isFiltered =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.department !== 'all';

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3',
        className
      )}
      aria-label="Filter ticket categories"
    >
      {/* Search Bar */}
      <div className="w-full sm:w-80">
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
          placeholder="Search categories by name or description..."
          showShortcut={false}
          aria-label="Search categories"
        />
      </div>

      {/* Filter Dropdowns & Clear Action */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Select
          aria-label="Filter by Status"
          value={filters.status}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value as CategoryStatus | 'all',
            })
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium min-w-[130px]"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Select
          aria-label="Filter by Default Department"
          value={filters.department}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              department: e.target.value,
            })
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium min-w-[150px]"
        >
          <option value="all">All Departments</option>
          {TICKET_DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </Select>

        <span className="text-xs text-[#6B7F7F] px-2.5 py-1.5 bg-[#F3F9F7] rounded-md border border-[#E5EDE9] select-none whitespace-nowrap">
          Showing <strong className="text-[#102A2A]">{resultCount}</strong> of{' '}
          {totalCount}
        </span>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            leftIcon={<XIcon size={14} />}
            className="text-[#6B7F7F] hover:text-[#DC2626] text-xs h-9"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
