'use client';

import React from 'react';
import Link from 'next/link';
import { TicketCategory, CategoryCalculatedStats } from '@/types/category';
import { Badge } from '@/components/ui/badge';
import { CategoryActionsMenu } from '@/components/categories/category-actions-menu';

export interface CategoryTableProps {
  categories: TicketCategory[];
  statsMap: Record<string, CategoryCalculatedStats>;
  onEdit: (category: TicketCategory) => void;
  onRequestStatusToggle: (category: TicketCategory) => void;
}

export const CategoryTable = ({
  categories,
  statsMap,
  onEdit,
  onRequestStatusToggle,
}: CategoryTableProps) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-xs text-[#102A2A] border-collapse">
        <thead className="bg-[#F3F9F7]/80 text-[11px] font-semibold uppercase tracking-wider text-[#6B7F7F] border-b border-[#E5EDE9]">
          <tr>
            <th className="py-3 px-5">Category</th>
            <th className="py-3 px-4">Default Department</th>
            <th className="py-3 px-4">Tickets</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5EDE9]/70 bg-white">
          {categories.map((cat) => {
            const stats = statsMap[cat.id] || {
              totalTickets: 0,
              activeTickets: 0,
              resolvedTickets: 0,
            };

            const isInactive = cat.status === 'inactive';

            return (
              <tr
                key={cat.id}
                className="hover:bg-[#F3F9F7]/50 transition-colors group"
              >
                {/* 1. Category Name & Description */}
                <td className="py-3.5 px-5">
                  <div className="flex flex-col min-w-0 max-w-sm">
                    <span className="font-semibold text-xs text-[#102A2A] group-hover:text-[#063F3F] transition-colors truncate">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-[#6B7F7F] line-clamp-1 mt-0.5">
                      {cat.description}
                    </span>
                  </div>
                </td>

                {/* 2. Default Department */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F3F9F7] text-[#063F3F] border border-[#E5EDE9]">
                    {cat.departmentDefault}
                  </span>
                </td>

                {/* 3. Tickets count & breakdown */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <Link
                      href={`/tickets?category=${encodeURIComponent(cat.name)}`}
                      className="font-semibold text-xs text-[#102A2A] hover:text-[#063F3F] hover:underline"
                    >
                      {stats.totalTickets} {stats.totalTickets === 1 ? 'ticket' : 'tickets'}
                    </Link>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#6B7F7F] mt-0.5">
                      <span className="text-[#063F3F] font-medium">{stats.activeTickets} active</span>
                      <span>•</span>
                      <span>{stats.resolvedTickets} resolved</span>
                    </div>
                  </div>
                </td>

                {/* 4. Status Badge */}
                <td className="py-3.5 px-4">
                  <Badge
                    variant={isInactive ? 'neutral' : 'success'}
                    size="sm"
                  >
                    {isInactive ? 'Inactive' : 'Active'}
                  </Badge>
                </td>

                {/* 5. Actions */}
                <td className="py-3.5 px-5 text-right">
                  <CategoryActionsMenu
                    category={cat}
                    onEdit={onEdit}
                    onRequestStatusToggle={onRequestStatusToggle}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
