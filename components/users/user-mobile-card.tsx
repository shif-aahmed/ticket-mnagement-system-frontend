'use client';

import React from 'react';
import { AdminUser, AdminUserRole, AdminUserStatus } from '@/types/user';
import { Avatar } from '@/components/ui/avatar';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { ClockIcon } from '@/components/ui/icons';
import { UserActionsMenu } from '@/components/users/user-actions-menu';

export interface UserMobileCardProps {
  user: AdminUser;
  onViewUser: (user: AdminUser) => void;
  onEditUser: (user: AdminUser) => void;
  onRequestStatusToggle: (user: AdminUser) => void;
}

const roleBadgeMap: Record<AdminUserRole, { variant: BadgeVariant; label: string }> = {
  administrator: { variant: 'default', label: 'Admin' },
  agent: { variant: 'active', label: 'Agent' },
  employee: { variant: 'neutral', label: 'Employee' },
};

const statusBadgeMap: Record<AdminUserStatus, { variant: BadgeVariant; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'neutral', label: 'Inactive' },
};

export const UserMobileCard = ({
  user,
  onViewUser,
  onEditUser,
  onRequestStatusToggle,
}: UserMobileCardProps) => {
  const roleMeta = roleBadgeMap[user.role] || {
    variant: 'neutral',
    label: user.role,
  };
  const statusMeta = statusBadgeMap[user.status] || {
    variant: 'neutral',
    label: user.status,
  };

  return (
    <div className="p-4 bg-white border border-[#E5EDE9] rounded-xl space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] text-left">
      {/* Top row: Avatar + Name + Email + Role badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            name={user.name}
            size="sm"
            className={
              user.role === 'administrator'
                ? 'bg-[#064747]'
                : user.role === 'agent'
                ? 'bg-[#0F766E]'
                : 'bg-[#475569]'
            }
          />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#102A2A] leading-tight truncate">
              {user.name}
            </h3>
            <p className="text-xs text-[#6B7F7F] truncate">{user.email}</p>
          </div>
        </div>

        <Badge variant={roleMeta.variant} size="sm">
          {roleMeta.label}
        </Badge>
      </div>

      {/* Middle row: Department & Status */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F1F5F4] text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
            Department
          </span>
          <p className="text-xs font-medium text-[#102A2A] truncate">
            {user.department}
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
            Status
          </span>
          <div>
            <Badge variant={statusMeta.variant} dot size="sm">
              {statusMeta.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom row: Last active & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F4]">
        <div className="flex items-center gap-1 text-[11px] text-[#6B7F7F]">
          <ClockIcon size={12} />
          <span>Active {user.lastActive}</span>
        </div>

        <UserActionsMenu
          user={user}
          onView={onViewUser}
          onEdit={onEditUser}
          onRequestStatusToggle={onRequestStatusToggle}
        />
      </div>
    </div>
  );
};
