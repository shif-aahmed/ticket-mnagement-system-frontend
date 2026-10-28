'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Team, TeamCalculatedStats, WorkloadStatus } from '@/types/team';
import { Ticket } from '@/types/ticket';
import { Avatar } from '@/components/ui/avatar';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import {
  XIcon,
  UsersIcon,
  ArrowUpRightIcon,
  ClockIcon,
} from '@/components/ui/icons';

export interface TeamDetailsModalProps {
  team: Team | null;
  stats: TeamCalculatedStats | null;
  tickets: Ticket[];
  isOpen: boolean;
  onClose: () => void;
}

const workloadBadgeMap: Record<WorkloadStatus, { variant: BadgeVariant; label: string }> = {
  normal: { variant: 'active', label: 'Workload: Normal' },
  heavy: { variant: 'warning', label: 'Workload: Heavy' },
  critical: { variant: 'urgent', label: 'Workload: Critical' },
};

const statusBadgeMap: Record<string, BadgeVariant> = {
  submitted: 'neutral',
  open: 'active',
  in_progress: 'warning',
  pending: 'warning',
  resolved: 'success',
  closed: 'neutral',
};

const priorityBadgeMap: Record<string, BadgeVariant> = {
  critical: 'urgent',
  high: 'warning',
  medium: 'active',
  low: 'neutral',
};

export const TeamDetailsModal = ({
  team,
  stats,
  tickets,
  isOpen,
  onClose,
}: TeamDetailsModalProps) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !team || !stats) return null;

  const workloadInfo = workloadBadgeMap[stats.workloadStatus];
  const targetTicketsUrl = `/tickets?department=${encodeURIComponent(team.department)}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`team-details-title-${team.id}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl border border-[#E5EDE9] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EDE9] bg-[#FAFDFC]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-[#EBF5EE] text-[#063F3F] flex items-center justify-center shrink-0 border border-[#D5EADB]">
              <UsersIcon size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  id={`team-details-title-${team.id}`}
                  className="text-base font-bold text-[#102A2A] truncate"
                >
                  {team.name}
                </h3>
                <span className="text-[11px] font-semibold text-[#4B6358] bg-[#EBF5EE] px-2 py-0.5 rounded border border-[#D5EADB]">
                  {team.department}
                </span>
                <Badge variant={workloadInfo.variant} dot size="sm">
                  {workloadInfo.label}
                </Badge>
              </div>
              <p className="text-xs text-[#6B7F7F] mt-0.5">
                {team.members.length} team members • {stats.activeTickets} active tickets
              </p>
            </div>
          </div>

          <IconButton
            aria-label="Close team details"
            onClick={onClose}
            className="text-[#6B7F7F] hover:text-[#102A2A]"
          >
            <XIcon size={16} />
          </IconButton>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Description */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7F7F]">
              Team Purpose & Mission
            </span>
            <p className="text-xs md:text-sm text-[#374949] leading-relaxed">
              {team.description}
            </p>
          </div>

          {/* Workload Summary Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-[#F3F9F7]/60 rounded-xl border border-[#E5EDE9] text-center">
            <div>
              <span className="text-[11px] font-semibold text-[#6B7F7F] block">Active Workload</span>
              <span className="text-lg font-bold text-[#102A2A] block mt-0.5">
                {stats.activeTickets}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#6B7F7F] block">Resolved Work</span>
              <span className="text-lg font-bold text-[#059669] block mt-0.5">
                {stats.resolvedTickets}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#6B7F7F] block">Overdue Items</span>
              <span
                className={`text-lg font-bold block mt-0.5 ${
                  stats.overdueTickets > 0 ? 'text-[#DC2626]' : 'text-[#6B7F7F]'
                }`}
              >
                {stats.overdueTickets}
              </span>
            </div>
          </div>

          {/* Team Lead Card */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7F7F]">
              Team Lead
            </span>
            <div className="p-3 bg-white rounded-xl border border-[#E5EDE9] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={team.teamLead.name} size="md" className="bg-[#064747]" />
                <div className="min-w-0">
                  <span className="text-sm font-bold text-[#102A2A] block truncate">
                    {team.teamLead.name}
                  </span>
                  <span className="text-xs text-[#063F3F] font-medium block truncate">
                    {team.teamLead.role}
                  </span>
                  <span className="text-[11px] text-[#6B7F7F] block truncate">
                    {team.teamLead.email}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
                Lead
              </span>
            </div>
          </div>

          {/* Team Members List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7F7F]">
                Team Members ({team.members.length})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 bg-white rounded-lg border border-[#E5EDE9] flex items-center gap-2.5"
                >
                  <Avatar name={member.name} size="sm" />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[#102A2A] block truncate">
                      {member.name}
                    </span>
                    <span className="text-[11px] text-[#6B7F7F] block truncate">
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Relevant Tickets for this Team */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7F7F]">
                Relevant Work & Active Tickets
              </span>
              <span className="text-[11px] text-[#6B7F7F]">
                {tickets.length} total in {team.department}
              </span>
            </div>

            {tickets.length === 0 ? (
              <div className="p-4 bg-[#FAFDFC] rounded-lg border border-[#E5EDE9] text-center text-xs text-[#6B7F7F]">
                No active tickets currently assigned to this team.
              </div>
            ) : (
              <div className="space-y-2">
                {tickets.slice(0, 4).map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/tickets/${ticket.id.replace('#', '')}`}
                    className="group block p-3 bg-white rounded-lg border border-[#E5EDE9] hover:border-[#063F3F]/40 hover:bg-[#F3F9F7]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#063F3F]">
                          {ticket.id}
                        </span>
                        {ticket.type && (
                          <span className="text-[10px] font-semibold text-[#4B6358] bg-[#EBF5EE] px-1.5 py-0.5 rounded border border-[#D5EADB]">
                            {ticket.type.replace('_', ' ')}
                          </span>
                        )}
                        <Badge
                          variant={priorityBadgeMap[ticket.priority] || 'neutral'}
                          dot
                          size="sm"
                        >
                          <span className="capitalize">{ticket.priority}</span>
                        </Badge>
                      </div>

                      <Badge
                        variant={statusBadgeMap[ticket.status] || 'neutral'}
                        size="sm"
                      >
                        <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>

                    <p className="text-xs font-medium text-[#102A2A] group-hover:text-[#063F3F] mt-1 line-clamp-1">
                      {ticket.subject}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#6B7F7F] mt-1 pt-1 border-t border-[#F1F5F4]">
                      <span>Assignee: {ticket.assignee.name}</span>
                      {ticket.dueDate && (
                        <span className="text-[#0F766E] font-medium flex items-center gap-1">
                          <ClockIcon size={11} />
                          <span>Due: {ticket.dueDate}</span>
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5EDE9] bg-[#FAFDFC] gap-3">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>

          <Link href={targetTicketsUrl}>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowUpRightIcon size={14} />}
            >
              View All {team.name} Tickets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
