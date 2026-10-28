import React from 'react';
import { TicketTypeDistribution } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface TicketTypeOverviewProps {
  data: TicketTypeDistribution[];
  className?: string;
}

export const TicketTypeOverview = ({ data, className = '' }: TicketTypeOverviewProps) => {
  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Work & Ticket Types</CardTitle>
            <CardDescription className="mt-1">
              Unified cross-functional workload breakdown ({totalCount.toLocaleString()} items)
            </CardDescription>
          </div>
          <span className="text-xs font-semibold text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
            Classification
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Multi-Segment Proportion Bar */}
        <div className="space-y-1.5">
          <div
            className="w-full h-3.5 bg-[#F1F5F9] rounded-full overflow-hidden flex gap-0.5 p-0.5"
            role="progressbar"
            aria-label="Ticket type distribution"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={100}
          >
            {data.map((item, index) => {
              const itemKey = (item.type || item.id || item.label)
                ? `${item.type || item.id || item.label}-${index}`
                : `ticket-type-${index}`;
              return (
                <div
                  key={itemKey}
                  style={{ width: `${item.percentage}%` }}
                  className={cn('h-full rounded-sm transition-all duration-300', item.colorClass)}
                  title={`${item.label}: ${item.count} (${item.percentage}%)`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6B7F7F] px-0.5">
            <span>Operational & Tasks</span>
            <span>Support & Incidents</span>
            <span>Requests</span>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((item, index) => {
            const itemKey = (item.type || item.id || item.label)
              ? `${item.type || item.id || item.label}-${index}`
              : `ticket-type-${index}`;
            return (
              <div
                key={itemKey}
                className="p-3 rounded-lg border border-[#E5EDE9] bg-[#F3F9F7]/40 flex flex-col justify-between space-y-2 hover:bg-white hover:border-[#CBD5E1] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', item.colorClass)} aria-hidden="true" />
                    <span className="text-xs font-semibold text-[#102A2A]">{item.label}</span>
                  </div>
                  <Badge variant={item.badgeVariant || 'default'} size="sm">
                    {item.percentage}%
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-lg font-bold text-[#102A2A]">
                    {item.count.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#6B7F7F]">tickets</span>
                </div>

                {/* Mini Individual Progress Track */}
                <div className="w-full h-1 bg-[#E2ECE9] rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', item.colorClass)}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
