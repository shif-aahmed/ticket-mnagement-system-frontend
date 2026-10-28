import React from 'react';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { XIcon } from '@/components/ui/icons';
import { TeamFiltersState, WorkloadStatus } from '@/types/team';
import { cn } from '@/lib/utils';

export interface TeamFiltersProps {
  filters: TeamFiltersState;
  onFilterChange: (filters: TeamFiltersState) => void;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
  className?: string;
}

const workloadOptions: { value: WorkloadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Workloads' },
  { value: 'normal', label: 'Normal' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'critical', label: 'Critical' },
];

export const TeamFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
  totalCount,
  className = '',
}: TeamFiltersProps) => {
  const isFiltered = filters.search.trim() !== '' || filters.workload !== 'all';

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3',
        className
      )}
      aria-label="Filter teams"
    >
      {/* Search Input */}
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
          placeholder="Search teams by name, lead, or member..."
          showShortcut={false}
          aria-label="Search teams"
        />
      </div>

      {/* Filter Controls & Counters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Select
          aria-label="Filter by Workload"
          value={filters.workload}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              workload: e.target.value as WorkloadStatus | 'all',
            })
          }
          containerClassName="w-auto"
          className="text-xs md:text-sm font-medium min-w-[140px]"
        >
          {workloadOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <span className="text-xs text-[#6B7F7F] px-2.5 py-1.5 bg-[#F3F9F7] rounded-md border border-[#E5EDE9] select-none whitespace-nowrap">
          Showing <strong className="text-[#102A2A]">{resultCount}</strong> of{' '}
          {totalCount} teams
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
