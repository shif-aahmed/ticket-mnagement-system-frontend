'use client';

import React from 'react';
import { TicketCategory } from '@/types/category';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { XIcon, AlertCircleIcon } from '@/components/ui/icons';

export interface CategoryStatusConfirmModalProps {
  category: TicketCategory;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: TicketCategory) => void;
}

export const CategoryStatusConfirmModal = ({
  category,
  isOpen,
  onClose,
  onConfirm,
}: CategoryStatusConfirmModalProps) => {
  if (!isOpen) return null;

  const isDeactivating = category.status === 'active';
  const actionText = isDeactivating ? 'Deactivate' : 'Activate';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`category-status-title-${category.id}`}
        className="bg-white rounded-xl border border-[#E5EDE9] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5EDE9] bg-[#FAFDFC]">
          <div className="flex items-center gap-2">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center ${
                isDeactivating
                  ? 'bg-[#FEE2E2] text-[#EF4444]'
                  : 'bg-[#DDF4E9] text-[#15803D]'
              }`}
            >
              <AlertCircleIcon size={16} />
            </div>
            <h3
              id={`category-status-title-${category.id}`}
              className="text-sm font-bold text-[#102A2A]"
            >
              {actionText} Category
            </h3>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Close dialog"
            onClick={onClose}
            className="text-[#6B7F7F] hover:text-[#102A2A]"
          >
            <XIcon size={16} />
          </IconButton>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-[#102A2A] leading-relaxed">
            Are you sure you want to {isDeactivating ? 'deactivate' : 'activate'} the category{' '}
            <strong className="font-semibold text-[#063F3F]">&ldquo;{category.name}&rdquo;</strong>?
          </p>
          <p className="text-xs text-[#6B7F7F] leading-relaxed">
            {isDeactivating
              ? 'This category will be marked as inactive and hidden from new ticket creation options. Existing tickets will retain their category classification.'
              : 'This category will be marked as active and made available again in new ticket creation and filtering options.'}
          </p>
          <div className="p-2.5 bg-slate-50 border border-dashed border-[#CBD5E1] rounded-lg text-[11px] text-[#6B7F7F]">
            Note: This is a frontend session update for preview purposes. No backend or database modifications will occur.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-[#E5EDE9] bg-[#FAFDFC]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isDeactivating ? 'danger' : 'primary'}
            size="sm"
            onClick={() => {
              onConfirm(category);
              onClose();
            }}
          >
            {actionText} Category
          </Button>
        </div>
      </div>
    </div>
  );
};
