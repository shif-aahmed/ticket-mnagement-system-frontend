import React from 'react';
import { Card } from '@/components/ui/card';
import { TeamSummaryMetric } from '@/types/team';
import { TeamsIcon, UsersIcon, TicketsIcon, ClockIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface TeamSummaryProps {
  metrics: TeamSummaryMetric[];
  className?: string;
}

const metricIconMap: Record<string, React.ReactNode> = {
  teams: <TeamsIcon size={20} />,
  members: <UsersIcon size={20} />,
  active: <TicketsIcon size={20} />,
  overdue: <ClockIcon size={20} />,
};

const variantStyleMap = {
  default: 'text-[#063F3F] bg-[#EBF5EE] border-[#D5EADB]',
  active: 'text-[#0284C7] bg-[#E0F2FE] border-[#BAE6FD]',
  warning: 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A]',
  urgent: 'text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]',
  success: 'text-[#059669] bg-[#D1FAE5] border-[#A7F3D0]',
};

export const TeamSummary = ({ metrics, className = '' }: TeamSummaryProps) => {
  return (
    <div
      className={cn('grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4', className)}
      role="region"
      aria-label="Teams summary metrics"
    >
      {metrics.map((metric) => {
        const variant = metric.variant || 'default';
        const iconStyle = variantStyleMap[variant];
        const icon = metricIconMap[metric.id] || <TeamsIcon size={20} />;

        return (
          <Card
            key={metric.id}
            className="p-4 flex items-center gap-3.5 bg-white border border-[#E5EDE9] hover:border-[#CBD5E1] transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
          >
            <div
              className={cn(
                'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border',
                iconStyle
              )}
            >
              {icon}
            </div>

            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-[#6B7F7F] uppercase tracking-wider block truncate">
                {metric.label}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl md:text-2xl font-bold text-[#102A2A] tracking-tight">
                  {metric.value}
                </span>
                {metric.changeText && (
                  <span className="text-[11px] text-[#6B7F7F] truncate hidden sm:inline">
                    {metric.changeText}
                  </span>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
