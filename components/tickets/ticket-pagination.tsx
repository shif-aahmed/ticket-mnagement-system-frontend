import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';

export interface TicketPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const TicketPagination = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  className = '',
}: TicketPaginationProps) => {
  if (totalCount === 0) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalCount);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#E5EDE9] bg-white rounded-b-xl text-xs text-[#6B7F7F] ${className}`}
      aria-label="Pagination"
    >
      <div>
        Showing <span className="font-semibold text-[#102A2A]">{startIdx}</span> to{' '}
        <span className="font-semibold text-[#102A2A]">{endIdx}</span> of{' '}
        <span className="font-semibold text-[#102A2A]">{totalCount}</span> tickets
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeftIcon size={14} />}
          aria-label="Previous page"
        >
          Previous
        </Button>

        <span className="px-2 text-xs font-medium text-[#102A2A]">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRightIcon size={14} />}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
