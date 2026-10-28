import React from 'react';
import { Ticket, TicketPriority, TicketStatus } from '@/types/ticket';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { TicketActionsMenu } from '@/components/tickets/ticket-actions-menu';

export interface TicketTableProps {
  tickets: Ticket[];
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

export const TicketTable = ({
  tickets,
  onAssignAgent,
  onChangeStatus,
}: TicketTableProps) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-xs text-[#102A2A] border-collapse">
        <thead className="bg-[#F3F9F7]/80 text-[11px] font-semibold uppercase tracking-wider text-[#6B7F7F] border-b border-[#E5EDE9]">
          <tr>
            <th className="py-3 px-5">Ticket</th>
            <th className="py-3 px-4">Requester</th>
            <th className="py-3 px-4">Assignee</th>
            <th className="py-3 px-4">Priority</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Last Updated</th>
            <th className="py-3 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5EDE9]/70 bg-white">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="hover:bg-[#F3F9F7]/50 transition-colors group"
            >
              {/* 1. Ticket (ID + Type + Department + Subject + Project/Due) */}
              <td className="py-3.5 px-5 max-w-[320px]">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-[#063F3F]">
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
                  <p className="font-medium text-xs text-[#102A2A] line-clamp-1 group-hover:text-[#063F3F] transition-colors">
                    {ticket.subject}
                  </p>
                  {(ticket.project || ticket.dueDate) && (
                    <div className="flex items-center gap-2 text-[10px] text-[#6B7F7F]">
                      {ticket.project && (
                        <span className="truncate max-w-[140px]">
                          📁 {ticket.project}
                        </span>
                      )}
                      {ticket.dueDate && (
                        <span className="text-[#0F766E] font-medium">
                          ⏱ {ticket.dueDate}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </td>

              {/* 2. Requester (Avatar + Name) */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <Avatar name={ticket.requester.name} size="xs" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-xs text-[#102A2A] truncate max-w-[120px]">
                      {ticket.requester.name}
                    </span>
                    <span className="text-[10px] text-[#6B7F7F] truncate max-w-[120px]">
                      {ticket.requester.email}
                    </span>
                  </div>
                </div>
              </td>

              {/* 3. Assignee (Avatar + Name) */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <Avatar name={ticket.assignee.name} size="xs" className="bg-[#064747]" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-xs text-[#102A2A] truncate max-w-[120px]">
                      {ticket.assignee.name}
                    </span>
                    <span className="text-[10px] text-[#6B7F7F] truncate max-w-[120px]">
                      {ticket.assignee.email}
                    </span>
                  </div>
                </div>
              </td>

              {/* 4. Priority */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <Badge variant={priorityBadgeMap[ticket.priority]} dot size="sm">
                  <span className="capitalize">{ticket.priority}</span>
                </Badge>
              </td>

              {/* 5. Status */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <Badge variant={statusBadgeMap[ticket.status]} size="sm">
                  <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                </Badge>
              </td>

              {/* 6. Last Updated */}
              <td className="py-3.5 px-4 text-[#6B7F7F] text-xs whitespace-nowrap">
                {ticket.updatedAt}
              </td>

              {/* 7. Actions */}
              <td className="py-3.5 px-5 text-right whitespace-nowrap">
                <TicketActionsMenu
                  ticketId={ticket.id}
                  currentAssigneeName={ticket.assignee.name}
                  currentStatus={ticket.status}
                  onAssignAgent={onAssignAgent}
                  onChangeStatus={onChangeStatus}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
