import React from 'react';
import { Ticket } from '@/types/ticket';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface EmployeeStatusOverviewProps {
  tickets: Ticket[];
  className?: string;
  onSelectStatus?: (status: 'open' | 'in_progress' | 'pending' | 'resolved') => void;
}

interface StatusItemConfig {
  status: 'open' | 'in_progress' | 'pending' | 'resolved';
  label: string;
  badgeVariant: BadgeVariant;
  barColor: string;
}

const statusConfigs: StatusItemConfig[] = [
  { status: 'open', label: 'Open', badgeVariant: 'active', barColor: 'bg-[#0D9488]' },
  { status: 'in_progress', label: 'In Progress', badgeVariant: 'warning', barColor: 'bg-[#F97316]' },
  { status: 'pending', label: 'Pending', badgeVariant: 'warning', barColor: 'bg-[#EAB308]' },
  { status: 'resolved', label: 'Resolved', badgeVariant: 'success', barColor: 'bg-[#22C55E]' },
];

export const EmployeeStatusOverview = ({
  tickets,
  className = '',
  onSelectStatus,
}: EmployeeStatusOverviewProps) => {
  const total = tickets.length || 1;

  const statusData = statusConfigs.map((cfg) => {
    const count = tickets.filter((t) => t.status === cfg.status).length;
    const percentage = tickets.length > 0 ? Math.round((count / total) * 100) : 0;
    return { ...cfg, count, percentage };
  });

  return (
    <Card className={className}>
      <CardHeader className="pb-3 border-b border-[#E5EDE9]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Status Overview</CardTitle>
            <CardDescription className="mt-0.5">
              Live lifecycle distribution of your submitted requests
            </CardDescription>
          </div>
          <span className="text-xs font-semibold text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
            {tickets.length} {tickets.length === 1 ? 'Request' : 'Requests'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Proportional Multi-Segment Track */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#6B7F7F]">
            <span>Resolution Pipeline</span>
            <span className="font-medium text-[#102A2A]">
              {statusData.find((s) => s.status === 'resolved')?.percentage || 0}% Resolved
            </span>
          </div>

          <div
            className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden flex gap-0.5 p-0.5"
            role="progressbar"
            aria-label="Ticket status distribution"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={100}
          >
            {statusData.map((item) =>
              item.percentage > 0 ? (
                <div
                  key={item.status}
                  style={{ width: `${item.percentage}%` }}
                  className={cn('h-full rounded-xs transition-all duration-300', item.barColor)}
                  title={`${item.label}: ${item.count} (${item.percentage}%)`}
                />
              ) : null
            )}
          </div>
        </div>

        {/* Individual Status Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {statusData.map((item) => (
            <div
              key={item.status}
              onClick={() => onSelectStatus?.(item.status)}
              className={cn(
                'p-3 rounded-xl border border-[#E5EDE9] bg-[#F3F9F7]/40 flex flex-col justify-between space-y-2 transition-colors',
                onSelectStatus && 'cursor-pointer hover:bg-[#F3F9F7] hover:border-[#063F3F]/30'
              )}
            >
              <div className="flex items-center justify-between">
                <Badge variant={item.badgeVariant} size="sm">
                  {item.label}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#102A2A]">{item.count}</span>
                  <span className="text-[10px] text-[#6B7F7F]">({item.percentage}%)</span>
                </div>
              </div>

              {/* CSS Progress Bar */}
              <div className="w-full h-1.5 bg-[#E2ECE9] rounded-full overflow-hidden">
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
  );
};
