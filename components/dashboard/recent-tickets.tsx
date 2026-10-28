import React from 'react';
import Link from 'next/link';
import { RecentTicket, TicketPriority, TicketStatus } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ClockIcon, ArrowUpRightIcon } from '@/components/ui/icons';

export interface RecentTicketsProps {
  tickets: RecentTicket[];
  className?: string;
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

export const RecentTickets = ({ tickets, className = '' }: RecentTicketsProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#E5EDE9]">
        <div>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription className="mt-1">
            Latest inquiries and active incidents requiring triage
          </CardDescription>
        </div>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#063F3F] hover:text-[#064747] hover:underline"
        >
          <span>View all tickets</span>
          <ArrowUpRightIcon size={14} />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-[#102A2A]">
            <thead className="bg-[#F3F9F7]/70 text-[11px] font-semibold uppercase tracking-wider text-[#6B7F7F] border-b border-[#E5EDE9]">
              <tr>
                <th className="py-3 px-5">Ticket ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EDE9]/60">
              {tickets.map((ticket) => {
                const ticketHref = `/tickets/${ticket.id.replace('#', '')}`;
                return (
                  <tr
                    key={ticket.id}
                    className="hover:bg-[#F3F9F7]/50 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-5 font-mono font-semibold text-[#063F3F]">
                      <Link href={ticketHref} className="hover:underline">
                        {ticket.id}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 max-w-[260px]">
                      <Link href={ticketHref} className="block group-hover:text-[#063F3F]">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
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
                        <p className="font-medium text-xs text-[#102A2A] truncate">
                          {ticket.subject}
                        </p>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={ticket.requester.name} size="xs" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium truncate max-w-[130px]">
                            {ticket.requester.name}
                          </span>
                          <span className="text-[10px] text-[#6B7F7F] truncate max-w-[130px]">
                            {ticket.requester.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={priorityBadgeMap[ticket.priority]} dot size="sm">
                        <span className="capitalize">{ticket.priority}</span>
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={statusBadgeMap[ticket.status]} size="sm">
                        <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 text-right text-[#6B7F7F] font-mono text-[11px] whitespace-nowrap">
                      {ticket.updatedAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View (Hidden on desktop) */}
        <div className="md:hidden divide-y divide-[#E5EDE9]">
          {tickets.map((ticket) => {
            const ticketHref = `/tickets/${ticket.id.replace('#', '')}`;
            return (
              <div key={ticket.id} className="p-4 space-y-2.5 hover:bg-[#F3F9F7]/40">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link href={ticketHref} className="font-mono text-xs font-bold text-[#063F3F] hover:underline">
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

                <Link href={ticketHref} className="block">
                  <h4 className="text-xs font-semibold text-[#102A2A] leading-snug hover:text-[#063F3F]">
                    {ticket.subject}
                  </h4>
                </Link>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <Avatar name={ticket.requester.name} size="xs" />
                    <span className="text-xs text-[#6B7F7F] truncate max-w-[150px]">
                      {ticket.requester.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#6B7F7F]">
                    <ClockIcon size={12} />
                    <span>{ticket.updatedAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
