import React from 'react';
import { PriorityDistribution } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircleIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface PriorityOverviewProps {
  data: PriorityDistribution[];
  className?: string;
}

export const PriorityOverview = ({ data, className = '' }: PriorityOverviewProps) => {
  const activeCount = data.reduce((acc, curr) => acc + curr.count, 0);
  const criticalItem = data.find((d) => d.priority === 'critical');

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Priority Overview</CardTitle>
            <CardDescription className="mt-1">
              Active queue urgency ({activeCount} open tickets)
            </CardDescription>
          </div>
          <span className="text-xs font-semibold text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
            Active
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Urgent Alert Banner (Subtle, professional, not loud) */}
        {criticalItem && criticalItem.count > 0 && (
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FEE2E2]/60 border border-[#FECACA] text-[#B91C1C]">
            <AlertCircleIcon size={16} className="shrink-0 text-[#EF4444]" />
            <div className="text-xs flex-1">
              <span className="font-semibold">{criticalItem.count} Critical Tickets</span>{' '}
              <span className="text-[#6B7F7F]">require immediate engineer intervention</span>
            </div>
          </div>
        )}

        {/* Priority Item Rows */}
        <div className="space-y-3 pt-1">
          {data.map((item) => (
            <div key={item.priority} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant={item.badgeVariant} dot size="sm">
                    {item.label}
                  </Badge>
                  <span className="text-[#6B7F7F] font-normal text-[11px]">
                    {item.percentage}% of active
                  </span>
                </div>
                <span className="font-semibold text-[#102A2A] text-xs">
                  {item.count}{' '}
                  <span className="font-normal text-[#6B7F7F] text-[11px]">tickets</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-300', item.colorClass)}
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
