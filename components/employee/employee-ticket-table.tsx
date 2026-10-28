import React from 'react';
import Link from 'next/link';
import { Ticket, TicketPriority, TicketStatus } from '@/types/ticket';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClockIcon, EyeIcon } from '@/components/ui/icons';

export interface EmployeeTicketTableProps {
  tickets: Ticket[];
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

export const EmployeeTicketTable = ({ tickets }: EmployeeTicketTableProps) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-xs text-[#102A2A] border-collapse">
        <thead className="bg-[#F3F9F7]/80 text-[11px] font-semibold uppercase tracking-wider text-[#6B7F7F] border-b border-[#E5EDE9]">
          <tr>
            <th className="py-3 px-5">Ticket</th>
            <th className="py-3 px-4">Subject</th>
            <th className="py-3 px-4">Priority</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Last Updated</th>
            <th className="py-3 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5EDE9]/70 bg-white">
          {tickets.map((ticket) => {
            const ticketDetailUrl = `/tickets/${encodeURIComponent(ticket.id)}`;

            return (
              <tr
                key={ticket.id}
                className="hover:bg-[#F3F9F7]/50 transition-colors group"
              >
                {/* 1. Ticket (ID + Type + Department) */}
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <div className="space-y-1">
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
                    </div>
                    {ticket.department && (
                      <span className="text-[10px] font-medium text-[#4B6358] bg-[#EBF5EE] px-1.5 py-0.5 rounded border border-[#D5EADB]">
                        {ticket.department}
                      </span>
                    )}
                  </div>
                </td>

                {/* 2. Subject + Project/Due Date */}
                <td className="py-3.5 px-4 max-w-md">
                  <div className="space-y-0.5">
                    <Link
                      href={ticketDetailUrl}
                      className="font-medium text-xs text-[#102A2A] hover:text-[#063F3F] line-clamp-1 group-hover:text-[#063F3F] transition-colors"
                    >
                      {ticket.subject}
                    </Link>
                    {(ticket.project || ticket.dueDate) && (
                      <div className="flex items-center gap-2 text-[10px] text-[#6B7F7F]">
                        {ticket.project && (
                          <span className="truncate max-w-[160px]">
                            📁 {ticket.project}
                          </span>
                        )}
                        {ticket.dueDate && (
                          <span className="text-[#0F766E] font-medium">
                            ⏱ Due: {ticket.dueDate}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                {/* 3. Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge variant={priorityBadgeMap[ticket.priority]} dot size="sm">
                    <span className="capitalize">{ticket.priority}</span>
                  </Badge>
                </td>

                {/* 4. Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge variant={statusBadgeMap[ticket.status]} size="sm">
                    <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                  </Badge>
                </td>

                {/* 5. Last Updated */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7F7F]">
                    <ClockIcon size={12} className="shrink-0 text-[#8DA09C]" />
                    <span>{ticket.updatedAt}</span>
                  </div>
                </td>

                {/* 6. Actions */}
                <td className="py-3.5 px-5 text-right whitespace-nowrap">
                  <Link href={ticketDetailUrl}>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<EyeIcon size={13} />}
                      className="text-xs h-8 hover:border-[#063F3F] hover:text-[#063F3F]"
                    >
                      View Details
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
