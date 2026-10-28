import React from 'react';
import Link from 'next/link';
import { Ticket, TicketPriority, TicketStatus } from '@/types/ticket';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClockIcon, EyeIcon } from '@/components/ui/icons';
import { Avatar } from '@/components/ui/avatar';

export interface EmployeeTicketCardProps {
  ticket: Ticket;
}

const priorityBadgeMap: Record<TicketPriority, BadgeVariant> = {
  critical: 'urgent',
  high: 'warning',
  medium: 'active',
  low: 'neutral',
};

const statusBadgeMap: Record<TicketStatus, BadgeVariant> = {
  submitted: 'neutral',
  open: 'active',
  in_progress: 'warning',
  pending: 'warning',
  resolved: 'success',
  closed: 'neutral',
};

export const EmployeeTicketCard = ({ ticket }: EmployeeTicketCardProps) => {
  const ticketDetailUrl = `/tickets/${encodeURIComponent(ticket.id)}`;

  return (
    <div className="p-4 bg-white border border-[#E5EDE9] rounded-xl space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      {/* Top row: ID + Type + Department + Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            href={ticketDetailUrl}
            className="font-mono text-xs font-bold text-[#063F3F] hover:underline"
          >
            {ticket.id}
          </Link>
          {ticket.type && (
            <Badge
              variant={
                ticket.type === 'incident'
                  ? 'urgent'
                  : ticket.type === 'bug'
                  ? 'warning'
                  : ticket.type === 'support_request'
                  ? 'active'
                  : 'active'
              }
              size="sm"
            >
              <span className="capitalize">{ticket.type.replace('_', ' ')}</span>
            </Badge>
          )}
          {ticket.department && (
            <span className="text-[10px] font-medium text-[#4B6358] bg-[#EBF5EE] px-1.5 py-0.5 rounded border border-[#D5EADB]">
              {ticket.department}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant={priorityBadgeMap[ticket.priority]} dot size="sm">
            <span className="capitalize">{ticket.priority}</span>
          </Badge>
          <Badge variant={statusBadgeMap[ticket.status]} size="sm">
            <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
          </Badge>
        </div>
      </div>

      {/* Subject & Description & Project/Due Date */}
      <div>
        <Link
          href={ticketDetailUrl}
          className="text-sm font-semibold text-[#102A2A] hover:text-[#063F3F] leading-snug transition-colors line-clamp-2"
        >
          {ticket.subject}
        </Link>
        {ticket.description && (
          <p className="text-xs text-[#6B7F7F] mt-1 line-clamp-2">
            {ticket.description}
          </p>
        )}
        {(ticket.project || ticket.dueDate) && (
          <div className="flex items-center gap-2 text-[11px] text-[#6B7F7F] mt-1.5 flex-wrap">
            {ticket.project && <span>📁 {ticket.project}</span>}
            {ticket.dueDate && (
              <span className="text-[#0F766E] font-medium">⏱ Due: {ticket.dueDate}</span>
            )}
          </div>
        )}
      </div>

      {/* Assigned Agent / Category */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F1F5F4] text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <Avatar name={ticket.assignee.name} size="xs" className="bg-[#064747]" />
          <span className="text-xs text-[#102A2A] font-medium truncate">
            {ticket.assignee.name || 'Unassigned'}
          </span>
        </div>
        {ticket.category && (
          <span className="text-[10px] text-[#6B7F7F] bg-[#F3F9F7] px-2 py-0.5 rounded border border-[#E5EDE9]">
            {ticket.category}
          </span>
        )}
      </div>

      {/* Bottom row: Last updated + Action */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F4]">
        <div className="flex items-center gap-1 text-[11px] text-[#6B7F7F]">
          <ClockIcon size={12} />
          <span>Updated {ticket.updatedAt}</span>
        </div>

        <Link href={ticketDetailUrl}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<EyeIcon size={13} />}
            className="text-xs h-7 px-2.5 hover:border-[#063F3F] hover:text-[#063F3F]"
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};
