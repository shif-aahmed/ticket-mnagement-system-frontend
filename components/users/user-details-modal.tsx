'use client';

import React, { useEffect } from 'react';
import { AdminUser } from '@/types/user';
import { Avatar } from '@/components/ui/avatar';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';
import {
  XIcon,
  ClockIcon,
  CheckCircleIcon,
  TicketsIcon,
} from '@/components/ui/icons';

export interface UserDetailsModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: AdminUser) => void;
}

const roleBadgeMap: Record<string, { variant: BadgeVariant; label: string }> = {
  administrator: { variant: 'default', label: 'Administrator' },
  agent: { variant: 'active', label: 'Support Agent' },
  employee: { variant: 'neutral', label: 'Employee' },
};

export const UserDetailsModal = ({
  user,
  isOpen,
  onClose,
  onEdit,
}: UserDetailsModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const roleMeta = roleBadgeMap[user.role] || {
    variant: 'neutral',
    label: user.role,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`user-details-title-${user.id}`}
        className="bg-white rounded-xl border border-[#E5EDE9] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EDE9] bg-[#FAFDFC]">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={user.name} size="md" className="bg-[#064747]" />
            <div className="min-w-0">
              <h3
                id={`user-details-title-${user.id}`}
                className="text-base font-bold text-[#102A2A] truncate"
              >
                {user.name}
              </h3>
              <p className="text-xs text-[#6B7F7F] truncate">{user.email}</p>
            </div>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Close user details"
            onClick={onClose}
            className="text-[#6B7F7F] hover:text-[#102A2A]"
          >
            <XIcon size={16} />
          </IconButton>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#F3F9F7]/60 border border-[#E5EDE9] rounded-xl text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
                System Role
              </span>
              <div>
                <Badge variant={roleMeta.variant} size="sm">
                  {roleMeta.label}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
                Account Status
              </span>
              <div>
                <Badge
                  variant={user.status === 'active' ? 'success' : 'neutral'}
                  dot
                  size="sm"
                >
                  <span className="capitalize">{user.status}</span>
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
                Department
              </span>
              <p className="font-semibold text-[#102A2A]">{user.department}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
                User Identifier
              </span>
              <p className="font-mono text-[11px] font-medium text-[#063F3F]">
                {user.id}
              </p>
            </div>
          </div>

          {/* Activity & Timeline Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7F7F]">
              Activity & Access
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white border border-[#E5EDE9] rounded-lg">
                <div className="flex items-center gap-2 text-[#6B7F7F]">
                  <ClockIcon size={14} className="text-[#063F3F]" />
                  <span>Last Active</span>
                </div>
                <span className="font-semibold text-[#102A2A]">{user.lastActive}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-[#E5EDE9] rounded-lg">
                <div className="flex items-center gap-2 text-[#6B7F7F]">
                  <CheckCircleIcon size={14} className="text-[#22C55E]" />
                  <span>Member Since</span>
                </div>
                <span className="font-semibold text-[#102A2A]">{user.createdAt}</span>
              </div>

              {user.activity?.ticketCount !== undefined && (
                <div className="flex items-center justify-between p-2.5 bg-white border border-[#E5EDE9] rounded-lg">
                  <div className="flex items-center gap-2 text-[#6B7F7F]">
                    <TicketsIcon size={14} className="text-[#063F3F]" />
                    <span>Assigned Tickets</span>
                  </div>
                  <span className="font-semibold text-[#102A2A]">
                    {user.activity.ticketCount} tickets
                  </span>
                </div>
              )}
            </div>

            {/* Recent Action Description */}
            {user.activity?.lastAction && (
              <div className="p-3 bg-slate-50 border border-[#E5EDE9] rounded-lg space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
                  Recent Audit Log
                </span>
                <p className="text-xs text-[#102A2A] leading-relaxed">
                  {user.activity.lastAction}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#E5EDE9] bg-[#FAFDFC]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(user);
            }}
          >
            Edit User
          </Button>
        </div>
      </div>
    </div>
  );
};
