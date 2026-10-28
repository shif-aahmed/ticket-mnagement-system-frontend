import React from 'react';
import { TicketSummaryMetric } from '@/types/ticket';
import { cn } from '@/lib/utils';

export interface TicketSummaryProps {
  metrics: TicketSummaryMetric[];
  className?: string;
}

const statusDotColors: Record<string, string> = {
  all: 'bg-[#063F3F]',
  open: 'bg-[#0D9488]',
  in_progress: 'bg-[#F97316]',
  pending: 'bg-[#EAB308]',
  resolved: 'bg-[#22C55E]',
};

export const TicketSummary = ({ metrics, className = '' }: TicketSummaryProps) => {
  return (
    <div
      className={cn(
        'bg-white border border-[#E5EDE9] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#E5EDE9] overflow-hidden',
        className
      )}
      aria-label="Ticket Summary Metrics"
    >
      {metrics.map((metric) => {
        const dotColor = statusDotColors[metric.id] || 'bg-[#063F3F]';

        return (
          <div
            key={metric.id}
            className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#F3F9F7]/50 transition-colors"
          >
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 rounded-full shrink-0', dotColor)} aria-hidden="true" />
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
