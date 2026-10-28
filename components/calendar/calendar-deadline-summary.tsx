'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import {
  AlertCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@/components/ui/icons';
import { CalendarDeadlineItem } from '@/types/calendar';

export interface CalendarDeadlineSummaryProps {
  overdueItems: CalendarDeadlineItem[];
  upcomingItems: CalendarDeadlineItem[];
}

export const CalendarDeadlineSummary = ({
  overdueItems,
  upcomingItems,
}: CalendarDeadlineSummaryProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      {/* 1. OVERDUE DEADLINES */}
      <Card className="border-[#E5EDE9] bg-white overflow-hidden shadow-xs flex flex-col">
        <CardHeader className="p-4 border-b border-[#FEE2E2]/60 bg-[#FEF2F2]/30 flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
              <AlertCircleIcon size={18} />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-[#991B1B]">
                Overdue Deliverables
              </CardTitle>
              <p className="text-[11px] text-[#6B7F7F]">
                Unresolved deliverables past target due date
              </p>
            </div>
          </div>

          <Badge variant={overdueItems.length > 0 ? 'urgent' : 'success'} size="sm">
            {overdueItems.length} overdue
          </Badge>
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          {overdueItems.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#DDF4E9] text-[#064747] flex items-center justify-center">
                <CheckCircleIcon size={20} />
              </div>
              <p className="text-xs font-bold text-[#102A2A]">
                No Overdue Tickets
              </p>
              <p className="text-[11px] text-[#6B7F7F] max-w-xs">
                All scheduled work items in this selection are within compliance SLA targets.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {overdueItems.map(({ ticket, durationLabel }) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="block p-3 rounded-xl border border-[#FCA5A5]/60 bg-[#FEF2F2]/20 hover:bg-[#FEF2F2]/50 hover:border-[#DC2626] transition-all group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#DC2626]">
                        {ticket.id}
                      </span>
                      <span className="text-[11px] text-[#6B7F7F]">
                        • {ticket.department || 'General'}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-[#B91C1C] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
                      ⚠️ {durationLabel}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#102A2A] group-hover:text-[#991B1B] transition-colors line-clamp-1">
                    {ticket.subject}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#FCA5A5]/30 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Avatar
                        name={ticket.assignee.name}
                        size="xs"
                        className="w-5 h-5 text-[9px]"
                      />
                      <span className="text-[#4A5D5D] font-medium truncate max-w-[130px]">
                        {ticket.assignee.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          ticket.priority === 'critical'
                            ? 'urgent'
                            : ticket.priority === 'high'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <ArrowRightIcon size={13} className="text-[#991B1B] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. UPCOMING DEADLINES */}
      <Card className="border-[#E5EDE9] bg-white overflow-hidden shadow-xs flex flex-col">
        <CardHeader className="p-4 border-b border-[#E5EDE9] bg-[#FCFDFD] flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#DDF4E9] text-[#064747] flex items-center justify-center shrink-0">
              <ClockIcon size={18} />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-[#102A2A]">
                Upcoming Milestones & Deadlines
              </CardTitle>
              <p className="text-[11px] text-[#6B7F7F]">
                Chronological list of next scheduled ticket resolutions
              </p>
            </div>
          </div>

          <Badge variant="active" size="sm">
            {upcomingItems.length} upcoming
          </Badge>
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          {upcomingItems.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#F3F9F7] text-[#6B7F7F] flex items-center justify-center">
                <ClockIcon size={20} />
              </div>
              <p className="text-xs font-bold text-[#102A2A]">
                No Upcoming Deadlines
              </p>
              <p className="text-[11px] text-[#6B7F7F] max-w-xs">
                No active tickets match the current filter selection.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingItems.slice(0, 5).map(({ ticket, durationLabel }) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="block p-3 rounded-xl border border-[#E5EDE9] hover:border-[#064747] hover:bg-[#F3F9F7]/60 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#064747]">
                        {ticket.id}
                      </span>
                      <span className="text-[11px] text-[#6B7F7F]">
                        • {ticket.department || 'General'}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        durationLabel === 'Due Today'
                          ? 'text-[#064747] bg-[#DDF4E9]'
                          : durationLabel === 'Due Tomorrow'
                          ? 'text-[#92400E] bg-[#FEF3C7]'
                          : 'text-[#4A5D5D] bg-[#F1F5F4]'
                      }`}
                    >
                      ⏱ {durationLabel}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#102A2A] group-hover:text-[#064747] transition-colors line-clamp-1">
                    {ticket.subject}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F5F4] text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Avatar
                        name={ticket.assignee.name}
                        size="xs"
                        className="w-5 h-5 text-[9px]"
                      />
                      <span className="text-[#4A5D5D] font-medium truncate max-w-[130px]">
                        {ticket.assignee.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          ticket.priority === 'critical'
                            ? 'urgent'
                            : ticket.priority === 'high'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <ArrowRightIcon size={13} className="text-[#064747] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
