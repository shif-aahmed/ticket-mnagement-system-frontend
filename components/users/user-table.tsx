'use client';

import React from 'react';
import { AdminUser, AdminUserRole, AdminUserStatus } from '@/types/user';
import { Avatar } from '@/components/ui/avatar';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { UserActionsMenu } from '@/components/users/user-actions-menu';

export interface UserTableProps {
  users: AdminUser[];
  onViewUser: (user: AdminUser) => void;
  onEditUser: (user: AdminUser) => void;
  onRequestStatusToggle: (user: AdminUser) => void;
}

const roleBadgeMap: Record<AdminUserRole, { variant: BadgeVariant; label: string }> = {
  administrator: { variant: 'default', label: 'Administrator' },
  agent: { variant: 'active', label: 'Agent' },
  employee: { variant: 'neutral', label: 'Employee' },
};

const statusBadgeMap: Record<AdminUserStatus, { variant: BadgeVariant; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'neutral', label: 'Inactive' },
};

export const UserTable = ({
  users,
  onViewUser,
  onEditUser,
  onRequestStatusToggle,
}: UserTableProps) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-xs text-[#102A2A] border-collapse">
        <thead className="bg-[#F3F9F7]/80 text-[11px] font-semibold uppercase tracking-wider text-[#6B7F7F] border-b border-[#E5EDE9]">
          <tr>
            <th className="py-3 px-5">User</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Last Active</th>
            <th className="py-3 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5EDE9]/70 bg-white">
          {users.map((user) => {
            const roleMeta = roleBadgeMap[user.role] || {
              variant: 'neutral',
              label: user.role,
            };
            const statusMeta = statusBadgeMap[user.status] || {
              variant: 'neutral',
              label: user.status,
            };

            return (
              <tr
                key={user.id}
                className="hover:bg-[#F3F9F7]/50 transition-colors group"
              >
                {/* 1. User (Avatar + Name) */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      name={user.name}
                      size="xs"
                      className={
                        user.role === 'administrator'
                          ? 'bg-[#064747]'
                          : user.role === 'agent'
                          ? 'bg-[#0F766E]'
                          : 'bg-[#475569]'
                      }
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs text-[#102A2A] group-hover:text-[#063F3F] transition-colors truncate max-w-[150px]">
                        {user.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#6B7F7F]">
                        {user.id}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. Email */}
                <td className="py-3.5 px-4 text-[#6B7F7F] truncate max-w-[200px]">
                  {user.email}
                </td>

                {/* 3. Role */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge variant={roleMeta.variant} size="sm">
                    {roleMeta.label}
                  </Badge>
                </td>

                {/* 4. Department */}
                <td className="py-3.5 px-4 text-[#102A2A] font-medium whitespace-nowrap">
                  {user.department}
                </td>

                {/* 5. Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge variant={statusMeta.variant} dot size="sm">
                    {statusMeta.label}
                  </Badge>
                </td>

                {/* 6. Last Active */}
                <td className="py-3.5 px-4 text-[#6B7F7F] text-xs whitespace-nowrap">
                  {user.lastActive}
                </td>

                {/* 7. Actions */}
                <td className="py-3.5 px-5 text-right whitespace-nowrap">
                  <UserActionsMenu
                    user={user}
                    onView={onViewUser}
                    onEdit={onEditUser}
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
