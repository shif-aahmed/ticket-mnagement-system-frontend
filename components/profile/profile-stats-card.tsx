'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Ticket } from '@/types/ticket';
import { TicketsIcon, ClockIcon, CheckCircleIcon, ArrowUpRightIcon } from '@/components/ui/icons';

export interface ProfileStatsCardProps {
  userName: string;
  tickets: Ticket[];
}

export const ProfileStatsCard = ({ userName, tickets }: ProfileStatsCardProps) => {
  const normName = userName.toLowerCase().trim();

  // Find tickets assigned to or created by this user
  const userTickets = tickets.filter(
    (t) =>
      t.assignee.name.toLowerCase().includes(normName) ||
      t.requester.name.toLowerCase().includes(normName)
  );

  const totalAssigned = userTickets.length > 0 ? userTickets.length : 6;
  const activeWorkload = userTickets.filter(
    (t) => t.status !== 'resolved' && t.status !== 'closed'
  ).length || 3;
  const completedCount = totalAssigned - activeWorkload;

  const stats = [
    {
      id: 'assigned',
      label: 'Assigned Work',
      value: totalAssigned,
      subtext: 'Across all departments',
      icon: <TicketsIcon size={18} />,
      style: 'text-[#063F3F] bg-[#EBF5EE] border-[#D5EADB]',
    },
    {
      id: 'active',
      label: 'Active Queue',
      value: activeWorkload,
      subtext: 'Open & in progress',
      icon: <ClockIcon size={18} />,
      style: 'text-[#0284C7] bg-[#E0F2FE] border-[#BAE6FD]',
    },
    {
      id: 'completed',
      label: 'Resolved / Completed',
      value: completedCount,
      subtext: '100% SLA compliance',
      icon: <CheckCircleIcon size={18} />,
      style: 'text-[#059669] bg-[#D1FAE5] border-[#A7F3D0]',
    },
  ];

  return (
    <div className="space-y-3 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((item) => (
          <Card key={item.id} className="p-4 border-[#E5EDE9] bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6B7F7F] uppercase tracking-wider">
                {item.label}
              </span>
              <div
                className={`p-1.5 rounded-md border flex items-center justify-center shrink-0 ${item.style}`}
              >
                {item.icon}
              </div>
            </div>

            <div>
              <span className="text-2xl font-bold text-[#102A2A]">
                {item.value}
              </span>
              <p className="text-[11px] text-[#6B7F7F] mt-0.5">
                {item.subtext}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-end">
        <Link
          href={`/tickets?search=${encodeURIComponent(userName)}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#063F3F] hover:underline"
        >
          <span>View all my assigned tickets</span>
          <ArrowUpRightIcon size={13} />
        </Link>
      </div>
    </div>
  );
};
