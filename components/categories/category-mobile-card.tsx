'use client';

import React from 'react';
import Link from 'next/link';
import { TicketCategory, CategoryCalculatedStats } from '@/types/category';
import { Badge } from '@/components/ui/badge';
import { CategoryActionsMenu } from '@/components/categories/category-actions-menu';

export interface CategoryMobileCardProps {
  category: TicketCategory;
  stats: CategoryCalculatedStats;
  onEdit: (category: TicketCategory) => void;
  onRequestStatusToggle: (category: TicketCategory) => void;
}

export const CategoryMobileCard = ({
  category,
  stats,
  onEdit,
  onRequestStatusToggle,
}: CategoryMobileCardProps) => {
  const isInactive = category.status === 'inactive';

  return (
    <div className="p-4 bg-white border border-[#E5EDE9] rounded-xl space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] text-left">
      {/* Top row: Category Name & Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#102A2A] leading-tight">
            {category.name}
          </h3>
          <p className="text-xs text-[#6B7F7F] mt-1 line-clamp-2">
            {category.description}
          </p>
        </div>

        <Badge variant={isInactive ? 'neutral' : 'success'} size="sm">
          {isInactive ? 'Inactive' : 'Active'}
        </Badge>
      </div>

      {/* Middle row: Department & Workload */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F1F5F4] text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
            Default Dept
          </span>
          <p className="text-xs font-medium text-[#102A2A] truncate">
            {category.departmentDefault}
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
            Tickets
          </span>
          <div>
            <Link
              href={`/tickets?category=${encodeURIComponent(category.name)}`}
              className="text-xs font-semibold text-[#063F3F] hover:underline"
            >
              {stats.totalTickets} total
            </Link>
            <span className="text-[10px] text-[#6B7F7F] block">
              {stats.activeTickets} active • {stats.resolvedTickets} resolved
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row: Actions */}
      <div className="flex items-center justify-end pt-2 border-t border-[#F1F5F4]">
        <CategoryActionsMenu
          category={category}
          onEdit={onEdit}
          onRequestStatusToggle={onRequestStatusToggle}
        />
      </div>
    </div>
  );
};
