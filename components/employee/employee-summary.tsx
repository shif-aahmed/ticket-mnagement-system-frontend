import React from 'react';
import { Ticket } from '@/types/ticket';
import { cn } from '@/lib/utils';

export interface EmployeeSummaryProps {
  tickets: Ticket[];
  className?: string;
  activeTab?: string;
  onTabSelect?: (status: 'all' | 'open' | 'in_progress' | 'pending' | 'resolved') => void;
}

export const EmployeeSummary = ({
  tickets,
  className = '',
  activeTab,
  onTabSelect,
}: EmployeeSummaryProps) => {
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const pendingCount = tickets.filter((t) => t.status === 'pending').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  const metrics: {
    id: 'all' | 'open' | 'in_progress' | 'pending' | 'resolved';
    label: string;
    count: number;
    dotColor: string;
  }[] = [
    {
      id: 'all',
      label: 'My Tickets',
      count: totalCount,
      dotColor: 'bg-[#063F3F]',
    },
    {
      id: 'open',
      label: 'Open',
      count: openCount,
      dotColor: 'bg-[#0D9488]',
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      count: inProgressCount,
      dotColor: 'bg-[#F97316]',
    },
    {
      id: 'pending',
      label: 'Pending',
      count: pendingCount,
      dotColor: 'bg-[#EAB308]',
    },
    {
      id: 'resolved',
      label: 'Resolved',
      count: resolvedCount,
      dotColor: 'bg-[#22C55E]',
    },
  ];

  return (
    <div
      className={cn(
        'bg-white border border-[#E5EDE9] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#E5EDE9] overflow-hidden',
        className
      )}
      aria-label="Employee Ticket Summary Overview"
    >
      {metrics.map((metric) => {
        const isSelected = activeTab === metric.id;
        const clickable = Boolean(onTabSelect);

        return (
          <div
            key={metric.id}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={() => onTabSelect?.(metric.id)}
            onKeyDown={(e) => {
              if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onTabSelect?.(metric.id);
              }
            }}
            className={cn(
              'px-4 py-3 flex items-center justify-between gap-3 transition-colors',
              clickable && 'cursor-pointer hover:bg-[#F3F9F7]/70',
              isSelected && 'bg-[#F3F9F7] ring-1 ring-inset ring-[#063F3F]/20'
            )}
            title={clickable ? `Filter by ${metric.label}` : undefined}
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
        );
      })}
    </div>
  );
};
