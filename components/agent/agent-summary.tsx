import React from 'react';
import { Ticket } from '@/types/ticket';
import { cn } from '@/lib/utils';

export interface AgentSummaryProps {
  tickets: Ticket[];
  className?: string;
}

export const AgentSummary = ({ tickets, className = '' }: AgentSummaryProps) => {
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const pendingCount = tickets.filter((t) => t.status === 'pending').length;
  const highPriorityCount = tickets.filter(
    (t) => t.priority === 'high' || t.priority === 'critical'
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  const metrics = [
    {
      id: 'open',
      label: 'My Open Tickets',
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
      id: 'high_priority',
      label: 'High Priority',
      count: highPriorityCount,
      dotColor: 'bg-[#EF4444]',
    },
    {
      id: 'resolved',
      label: 'Resolved Today',
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
      aria-label="Agent Workload Summary Metrics"
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
