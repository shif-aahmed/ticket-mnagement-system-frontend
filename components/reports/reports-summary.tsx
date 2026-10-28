import React from 'react';
import { Card } from '@/components/ui/card';
import { ReportsSummaryMetric } from '@/types/reports';
import {
  TicketsIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  DashboardIcon,
} from '@/components/ui/icons';

export interface ReportsSummaryProps {
  metrics: ReportsSummaryMetric[];
}

const metricIconMap: Record<string, React.ReactNode> = {
  total: <TicketsIcon size={18} />,
  active: <ClockIcon size={18} />,
  resolution_rate: <CheckCircleIcon size={18} />,
  overdue: <AlertCircleIcon size={18} />,
  critical: <AlertCircleIcon size={18} />,
  sla_compliance: <DashboardIcon size={18} />,
};

const variantStyleMap: Record<string, string> = {
  default: 'text-[#063F3F] bg-[#EBF5EE] border-[#D5EADB]',
  urgent: 'text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]',
  warning: 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A]',
  active: 'text-[#0284C7] bg-[#E0F2FE] border-[#BAE6FD]',
  success: 'text-[#059669] bg-[#D1FAE5] border-[#A7F3D0]',
};

export const ReportsSummary = ({ metrics }: ReportsSummaryProps) => {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
      role="region"
      aria-label="Management reporting summary metrics"
    >
      {metrics.map((metric) => {
        const variant = metric.variant || 'default';
        const iconStyle = variantStyleMap[variant];
        const icon = metricIconMap[metric.id] || <TicketsIcon size={18} />;

        return (
          <Card
            key={metric.id}
            className="p-3.5 flex flex-col justify-between space-y-2 border-[#E5EDE9] hover:border-[#CBD5E1] transition-all bg-white"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6B7F7F] uppercase tracking-wide truncate">
                {metric.label}
              </span>
              <div
                className={`p-1.5 rounded-md border flex items-center justify-center shrink-0 ${iconStyle}`}
                aria-hidden="true"
              >
                {icon}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-[#102A2A]">
                {metric.value}
              </span>
              {metric.changeText && (
                <p className="text-[10px] text-[#6B7F7F] line-clamp-1">
                  {metric.changeText}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
