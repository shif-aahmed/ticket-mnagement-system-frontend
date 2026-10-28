import React from 'react';
import { DashboardStat } from '@/types/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import {
  LayersIcon,
  TicketsIcon,
  PlayCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  stat: DashboardStat;
  className?: string;
}

const iconMap = {
  layers: LayersIcon,
  tickets: TicketsIcon,
  play: PlayCircleIcon,
  clock: ClockIcon,
  check: CheckCircleIcon,
};

const variantIconStyles: Record<
  DashboardStat['variant'],
  { bg: string; text: string; ring: string }
> = {
  default: {
    bg: 'bg-[#F3F9F7]',
    text: 'text-[#063F3F]',
    ring: 'border-[#E5EDE9]',
  },
  urgent: {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#B91C1C]',
    ring: 'border-[#FECACA]',
  },
  warning: {
    bg: 'bg-[#FFEDD5]',
    text: 'text-[#C2410C]',
    ring: 'border-[#FED7AA]',
  },
  active: {
    bg: 'bg-[#CCFBF1]',
    text: 'text-[#0F766E]',
    ring: 'border-[#99F6E4]',
  },
  success: {
    bg: 'bg-[#DDF4E9]',
    text: 'text-[#15803D]',
    ring: 'border-[#BBF7D0]',
  },
};

export const StatCard = ({ stat, className = '' }: StatCardProps) => {
  const IconComponent = iconMap[stat.icon] || LayersIcon;
  const iconStyle = variantIconStyles[stat.variant];

  return (
    <Card hoverEffect className={cn('overflow-hidden', className)}>
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-medium text-[#6B7F7F] uppercase tracking-wider truncate">
            {stat.label}
          </span>
          <div
            className={cn(
              'h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 transition-transform duration-150',
              iconStyle.bg,
              iconStyle.text,
              iconStyle.ring
            )}
            aria-hidden="true"
          >
            <IconComponent size={18} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-[#102A2A]">
            {stat.value}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {stat.trend === 'up' && (
              <span className="inline-flex items-center text-[#15803D] font-medium shrink-0">
                <TrendingUpIcon size={13} className="mr-0.5" />
              </span>
            )}
            {stat.trend === 'down' && (
              <span className="inline-flex items-center text-[#B91C1C] font-medium shrink-0">
                <TrendingDownIcon size={13} className="mr-0.5" />
              </span>
            )}
            <span
              className={cn(
                'truncate font-normal',
                stat.trend === 'up'
                  ? 'text-[#15803D]'
                  : stat.trend === 'down'
                  ? 'text-[#B91C1C]'
                  : 'text-[#6B7F7F]'
              )}
            >
              {stat.changeText}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
