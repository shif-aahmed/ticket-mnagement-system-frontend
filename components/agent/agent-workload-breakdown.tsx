import React from 'react';
import { Ticket, TicketPriority, TicketStatus } from '@/types/ticket';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface AgentWorkloadBreakdownProps {
  tickets: Ticket[];
  className?: string;
}

export const AgentWorkloadBreakdown = ({
  tickets,
  className = '',
}: AgentWorkloadBreakdownProps) => {
  const total = tickets.length || 1;

  // 1. Priority Breakdown Data
  const priorityConfig: {
    priority: TicketPriority;
    label: string;
    badgeVariant: BadgeVariant;
    barColor: string;
  }[] = [
    { priority: 'critical', label: 'Critical', badgeVariant: 'urgent', barColor: 'bg-[#EF4444]' },
    { priority: 'high', label: 'High', badgeVariant: 'warning', barColor: 'bg-[#F97316]' },
    { priority: 'medium', label: 'Medium', badgeVariant: 'active', barColor: 'bg-[#0D9488]' },
    { priority: 'low', label: 'Low', badgeVariant: 'neutral', barColor: 'bg-[#94A3B8]' },
  ];

  const priorityData = priorityConfig.map((cfg) => {
    const count = tickets.filter((t) => t.priority === cfg.priority).length;
    const percentage = Math.round((count / total) * 100);
    return { ...cfg, count, percentage };
  });

  // 2. Status Breakdown Data
  const statusConfig: {
    status: TicketStatus;
    label: string;
    badgeVariant: BadgeVariant;
    barColor: string;
  }[] = [
    { status: 'open', label: 'Open', badgeVariant: 'active', barColor: 'bg-[#0D9488]' },
    { status: 'in_progress', label: 'In Progress', badgeVariant: 'warning', barColor: 'bg-[#F97316]' },
    { status: 'pending', label: 'Pending', badgeVariant: 'warning', barColor: 'bg-[#EAB308]' },
    { status: 'resolved', label: 'Resolved', badgeVariant: 'success', barColor: 'bg-[#22C55E]' },
  ];

  const statusData = statusConfig.map((cfg) => {
    const count = tickets.filter((t) => t.status === cfg.status).length;
    const percentage = Math.round((count / total) * 100);
    return { ...cfg, count, percentage };
  });

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
      {/* 1. Priority Breakdown */}
      <Card>
        <CardHeader className="pb-3 border-b border-[#E5EDE9]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Priority Breakdown</CardTitle>
              <CardDescription className="mt-0.5">
                Urgency distribution across active assignments
              </CardDescription>
            </div>
            <span className="text-xs font-semibold text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
              {tickets.length} Assigned
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-3">
            {priorityData.map((item) => (
              <div key={item.priority} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.badgeVariant} dot size="sm">
                      {item.label}
                    </Badge>
                    <span className="text-[#6B7F7F] text-[11px]">
                      {item.percentage}%
                    </span>
                  </div>
                  <span className="font-semibold text-[#102A2A]">
                    {item.count}{' '}
                    <span className="font-normal text-[#6B7F7F] text-[11px]">
                      {item.count === 1 ? 'ticket' : 'tickets'}
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-300', item.barColor)}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Status Breakdown */}
      <Card>
        <CardHeader className="pb-3 border-b border-[#E5EDE9]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Status Breakdown</CardTitle>
              <CardDescription className="mt-0.5">
                Ticket progression through resolution pipeline
              </CardDescription>
            </div>
            <span className="text-xs font-semibold text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
              Lifecycle
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {/* Proportional Multi-Segment Track */}
          <div className="space-y-1">
            <div
              className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden flex gap-0.5 p-0.5"
              role="progressbar"
              aria-label="Agent ticket status distribution"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={100}
            >
              {statusData.map((item) => (
                <div
                  key={item.status}
                  style={{ width: `${item.percentage}%` }}
                  className={cn('h-full rounded-xs transition-all duration-300', item.barColor)}
                  title={`${item.label}: ${item.count} (${item.percentage}%)`}
                />
              ))}
            </div>
          </div>

          {/* Detailed Status Rows */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {statusData.map((item) => (
              <div
                key={item.status}
                className="p-2.5 rounded-lg border border-[#E5EDE9] bg-[#F3F9F7]/40 flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={item.badgeVariant} size="sm">
                    {item.label}
                  </Badge>
                  <span className="text-xs font-bold text-[#102A2A]">
                    {item.count}
                  </span>
                </div>
                <div className="w-full h-1 bg-[#E2ECE9] rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', item.barColor)}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
