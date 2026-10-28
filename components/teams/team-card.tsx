import React from 'react';
import Link from 'next/link';
import { Team, TeamCalculatedStats, WorkloadStatus } from '@/types/team';
import { Card } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface TeamCardProps {
  team: Team;
  stats: TeamCalculatedStats;
  onOpenDetails: (team: Team) => void;
  className?: string;
}

const workloadBadgeMap: Record<WorkloadStatus, { variant: BadgeVariant; label: string }> = {
  normal: { variant: 'active', label: 'Workload: Normal' },
  heavy: { variant: 'warning', label: 'Workload: Heavy' },
  critical: { variant: 'urgent', label: 'Workload: Critical' },
};

export const TeamCard = ({
  team,
  stats,
  onOpenDetails,
  className = '',
}: TeamCardProps) => {
  const workloadInfo = workloadBadgeMap[stats.workloadStatus];
  const targetTicketsUrl = `/tickets?department=${encodeURIComponent(team.department)}`;

  return (
    <Card
      className={cn(
        'p-5 bg-white border border-[#E5EDE9] rounded-xl flex flex-col justify-between space-y-4 hover:border-[#063F3F]/40 hover:shadow-[0_4px_12px_rgba(6,63,63,0.06)] transition-all duration-200',
        className
      )}
    >
      <div className="space-y-3.5">
        {/* Top Header: Team Name & Badges */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#102A2A] tracking-tight">
              {team.name}
            </h3>
            <span className="text-[11px] font-semibold text-[#4B6358] bg-[#EBF5EE] px-2 py-0.5 rounded border border-[#D5EADB]">
              {team.department}
            </span>
          </div>

          <Badge variant={workloadInfo.variant} dot size="sm">
            {workloadInfo.label}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-[#6B7F7F] leading-relaxed line-clamp-2">
          {team.description}
        </p>

        {/* Team Lead Section */}
        <div className="p-3 bg-[#FAFDFC] rounded-lg border border-[#E5EDE9] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={team.teamLead.name} size="sm" className="bg-[#064747]" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7F7F] block">
                Team Lead
              </span>
              <span className="text-xs font-semibold text-[#102A2A] block truncate">
                {team.teamLead.name}
              </span>
              <span className="text-[11px] text-[#6B7F7F] block truncate">
                {team.teamLead.role}
              </span>
            </div>
          </div>

          {/* Member Count Badge & Avatars */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex -space-x-1.5 overflow-hidden">
              {team.members.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="inline-block ring-2 ring-white rounded-full"
                  title={`${m.name} (${m.role})`}
                >
                  <Avatar name={m.name} size="xs" />
                </div>
              ))}
            </div>
            {team.members.length > 3 && (
              <span className="text-[11px] font-semibold text-[#4B6358] bg-[#E5EDE9] px-1.5 py-0.5 rounded-full">
                +{team.members.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Workload Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F1F5F4] text-center">
          <div className="p-2 rounded-md bg-[#F3F9F7]/50 border border-[#E5EDE9]/60">
            <span className="text-[10px] uppercase font-bold text-[#6B7F7F] block">
              Active
            </span>
            <span className="text-sm font-bold text-[#102A2A] block mt-0.5">
              {stats.activeTickets}
            </span>
          </div>

          <div className="p-2 rounded-md bg-[#F3F9F7]/50 border border-[#E5EDE9]/60">
            <span className="text-[10px] uppercase font-bold text-[#6B7F7F] block">
              Resolved
            </span>
            <span className="text-sm font-bold text-[#059669] block mt-0.5">
              {stats.resolvedTickets}
            </span>
          </div>

          <div className="p-2 rounded-md bg-[#F3F9F7]/50 border border-[#E5EDE9]/60">
            <span className="text-[10px] uppercase font-bold text-[#6B7F7F] block">
              Overdue
            </span>
            <span
              className={cn(
                'text-sm font-bold block mt-0.5',
                stats.overdueTickets > 0 ? 'text-[#DC2626]' : 'text-[#6B7F7F]'
              )}
            >
              {stats.overdueTickets}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F1F5F4]">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onOpenDetails(team)}
          className="text-xs flex-1 justify-center hover:border-[#063F3F] hover:text-[#063F3F]"
        >
          Team Details
        </Button>

        <Link href={targetTicketsUrl} className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowUpRightIcon size={14} />}
            className="w-full text-xs justify-center text-[#063F3F] hover:bg-[#F3F9F7] font-semibold"
          >
            View Tickets
          </Button>
        </Link>
      </div>
    </Card>
  );
};
