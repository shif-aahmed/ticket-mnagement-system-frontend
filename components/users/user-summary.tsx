import React from 'react';
import { AdminUser } from '@/types/user';
import { cn } from '@/lib/utils';

export interface UserSummaryProps {
  users: AdminUser[];
  className?: string;
}

export const UserSummary = ({ users, className = '' }: UserSummaryProps) => {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const agentsCount = users.filter((u) => u.role === 'agent').length;
  const employeesCount = users.filter((u) => u.role === 'employee').length;
  const adminsCount = users.filter((u) => u.role === 'administrator').length;

  const metrics = [
    {
      id: 'total',
      label: 'Total Users',
      count: totalUsers,
      dotColor: 'bg-[#063F3F]',
    },
    {
      id: 'active',
      label: 'Active Users',
      count: activeUsers,
      dotColor: 'bg-[#22C55E]',
    },
    {
      id: 'agents',
      label: 'Agents',
      count: agentsCount,
      dotColor: 'bg-[#0D9488]',
    },
    {
      id: 'employees',
      label: 'Employees',
      count: employeesCount,
      dotColor: 'bg-[#64748B]',
    },
    {
      id: 'admins',
      label: 'Administrators',
      count: adminsCount,
      dotColor: 'bg-[#064747]',
    },
  ];

  return (
    <div
      className={cn(
        'bg-white border border-[#E5EDE9] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#E5EDE9] overflow-hidden',
        className
      )}
      aria-label="User Summary Metrics"
    >
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#F3F9F7]/50 transition-colors"
        >
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className={cn('h-2 w-2 rounded-full shrink-0', metric.dotColor)}
                aria-hidden="true"
              />
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7F7F] truncate">
                {metric.label}
              </span>
            </div>
            <div className="text-xl font-bold tracking-tight text-[#102A2A] pl-3.5">
              {metric.count}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
