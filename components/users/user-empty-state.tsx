import React from 'react';
import { UsersIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';

export interface UserEmptyStateProps {
  onClearFilters: () => void;
  isFiltered: boolean;
}

export const UserEmptyState = ({
  onClearFilters,
  isFiltered,
}: UserEmptyStateProps) => {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3 bg-white border border-[#E5EDE9] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="h-12 w-12 rounded-xl bg-[#F3F9F7] text-[#063F3F] border border-[#E5EDE9] flex items-center justify-center">
        <UsersIcon size={24} />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-bold text-[#102A2A]">No users found</h3>
        <p className="text-xs text-[#6B7F7F]">
          Try adjusting your search query, role, or account status filters to find what you&apos;re looking for.
        </p>
      </div>

      {isFiltered && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};
