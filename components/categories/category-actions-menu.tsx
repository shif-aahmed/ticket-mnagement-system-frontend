'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { TicketCategory } from '@/types/category';
import { IconButton } from '@/components/ui/icon-button';
import { MoreVerticalIcon, ArrowUpRightIcon, EditIcon } from '@/components/ui/icons';

export interface CategoryActionsMenuProps {
  category: TicketCategory;
  onEdit: (category: TicketCategory) => void;
  onRequestStatusToggle: (category: TicketCategory) => void;
}

export const CategoryActionsMenu = ({
  category,
  onEdit,
  onRequestStatusToggle,
}: CategoryActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isDeactivating = category.status === 'active';
  const targetTicketsUrl = `/tickets?category=${encodeURIComponent(category.name)}`;

  return (
    <div ref={menuRef} className="relative inline-flex items-center gap-1.5">
      {/* View Related Tickets CTA */}
      <Link
        href={targetTicketsUrl}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#063F3F] bg-white border border-[#E5EDE9] rounded-md hover:bg-[#F3F9F7] hover:border-[#CBD5E1] transition-colors cursor-pointer whitespace-nowrap"
        title={`View tickets for ${category.name}`}
      >
        <span>Tickets</span>
        <ArrowUpRightIcon size={12} className="text-[#6B7F7F]" />
      </Link>

      {/* More Actions Toggle */}
      <IconButton
        variant="ghost"
        size="sm"
        aria-label={`Actions for category ${category.name}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-[#6B7F7F] hover:text-[#102A2A] h-7 w-7"
      >
        <MoreVerticalIcon size={15} />
      </IconButton>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-8 z-30 w-44 bg-white border border-[#E5EDE9] rounded-lg shadow-lg py-1 text-xs text-[#102A2A] animate-in fade-in zoom-in-95 duration-100 text-left">
          <Link
            href={targetTicketsUrl}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-[#F3F9F7] text-left transition-colors cursor-pointer"
          >
            <span>View related tickets</span>
            <ArrowUpRightIcon size={12} className="text-[#6B7F7F]" />
          </Link>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit(category);
            }}
            className="flex items-center justify-between w-full px-3 py-1.5 hover:bg-[#F3F9F7] text-left transition-colors cursor-pointer"
          >
            <span>Edit category</span>
            <EditIcon size={12} className="text-[#6B7F7F]" />
          </button>

          <div className="my-1 border-t border-[#F1F5F4]" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onRequestStatusToggle(category);
            }}
            className={`flex items-center w-full px-3 py-1.5 hover:bg-[#F3F9F7] text-left font-medium transition-colors cursor-pointer ${
              isDeactivating
                ? 'text-[#EF4444] hover:text-[#DC2626]'
                : 'text-[#15803D] hover:text-[#166534]'
            }`}
          >
            {isDeactivating ? 'Deactivate category' : 'Activate category'}
          </button>
        </div>
      )}
    </div>
  );
};
