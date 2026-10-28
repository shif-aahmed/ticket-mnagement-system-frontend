'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AdminUser } from '@/types/user';
import { IconButton } from '@/components/ui/icon-button';
import { MoreVerticalIcon, EyeIcon } from '@/components/ui/icons';

export interface UserActionsMenuProps {
  user: AdminUser;
  onView: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onRequestStatusToggle: (user: AdminUser) => void;
}

export const UserActionsMenu = ({
  user,
  onView,
  onEdit,
  onRequestStatusToggle,
}: UserActionsMenuProps) => {
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

  const isDeactivating = user.status === 'active';
  const toggleLabel = isDeactivating ? 'Deactivate' : 'Activate';

  return (
    <div ref={menuRef} className="relative inline-flex items-center gap-1.5">
      {/* View Primary Link Button */}
      <button
        type="button"
        onClick={() => onView(user)}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#063F3F] bg-white border border-[#E5EDE9] rounded-md hover:bg-[#F3F9F7] hover:border-[#CBD5E1] transition-colors cursor-pointer"
        title={`View profile for ${user.name}`}
      >
        <EyeIcon size={14} className="text-[#6B7F7F]" />
        <span>View</span>
      </button>

      {/* More Actions Toggle */}
      <IconButton
        variant="ghost"
        size="sm"
        aria-label={`More actions for user ${user.name}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-[#6B7F7F] hover:text-[#102A2A] h-7 w-7"
      >
        <MoreVerticalIcon size={15} />
      </IconButton>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-8 z-30 w-40 bg-white border border-[#E5EDE9] rounded-lg shadow-lg py-1 text-xs text-[#102A2A] animate-in fade-in zoom-in-95 duration-100 text-left">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onView(user);
            }}
            className="flex items-center w-full px-3 py-1.5 hover:bg-[#F3F9F7] text-left transition-colors cursor-pointer"
          >
            View details
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit(user);
            }}
            className="flex items-center w-full px-3 py-1.5 hover:bg-[#F3F9F7] text-left transition-colors cursor-pointer"
          >
            Edit user
          </button>
          <div className="my-1 border-t border-[#F1F5F4]" />
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onRequestStatusToggle(user);
            }}
            className={`flex items-center w-full px-3 py-1.5 hover:bg-[#F3F9F7] text-left font-medium transition-colors cursor-pointer ${
              isDeactivating
                ? 'text-[#EF4444] hover:text-[#DC2626]'
                : 'text-[#15803D] hover:text-[#166534]'
            }`}
          >
            {toggleLabel} user
          </button>
        </div>
      )}
    </div>
  );
};
