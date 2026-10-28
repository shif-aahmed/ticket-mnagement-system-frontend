import React from 'react';
import { Ticket, TicketPriority, TicketStatus } from '@/types/ticket';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ClockIcon } from '@/components/ui/icons';
import { TicketActionsMenu } from '@/components/tickets/ticket-actions-menu';

export interface TicketMobileCardProps {
  ticket: Ticket;
  onAssignAgent?: (
    ticketId: string,
    assignee: { id: string; name: string; email: string }
  ) => void;
  onChangeStatus?: (ticketId: string, status: TicketStatus) => void;
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

export const TicketMobileCard = ({
  ticket,
  onAssignAgent,
  onChangeStatus,
}: TicketMobileCardProps) => {
  return (
    <div className="p-4 bg-white border border-[#E5EDE9] rounded-xl space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      {/* Top row: ID + Type + Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-xs font-bold text-[#063F3F]">
            {ticket.id}
          </span>
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

      {/* Subject */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[#102A2A] leading-snug">
          {ticket.subject}
        </h3>
        {(ticket.project || ticket.dueDate) && (
          <div className="flex items-center gap-2 text-[11px] text-[#6B7F7F] flex-wrap">
            {ticket.project && (
              <span>📁 {ticket.project}</span>
            )}
            {ticket.dueDate && (
              <span className="text-[#0F766E] font-medium">⏱ Due: {ticket.dueDate}</span>
            )}
          </div>
        )}
      </div>

      {/* People (Requester & Assignee) */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F1F5F4] text-xs">
        {/* Requester */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
            Requester
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <Avatar name={ticket.requester.name} size="xs" />
            <span className="text-xs text-[#102A2A] font-medium truncate">
              {ticket.requester.name}
            </span>
          </div>
        </div>

        {/* Assignee */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
            Assignee
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <Avatar name={ticket.assignee.name} size="xs" className="bg-[#064747]" />
            <span className="text-xs text-[#102A2A] font-medium truncate">
              {ticket.assignee.name}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row: Last updated + Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F4]">
        <div className="flex items-center gap-1 text-[11px] text-[#6B7F7F]">
          <ClockIcon size={12} />
          <span>Updated {ticket.updatedAt}</span>
        </div>
        <TicketActionsMenu
          ticketId={ticket.id}
          currentAssigneeName={ticket.assignee.name}
          currentStatus={ticket.status}
          onAssignAgent={onAssignAgent}
          onChangeStatus={onChangeStatus}
        />
      </div>
    </div>
  );
};
