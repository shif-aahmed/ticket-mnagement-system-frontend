'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import { AssigneeWorkloadSummary } from '@/types/reports';

export interface ReportsWorkloadTableProps {
  data: AssigneeWorkloadSummary[];
}

export const ReportsWorkloadTable = ({ data }: ReportsWorkloadTableProps) => {
  return (
    <Card className="flex flex-col border-[#E5EDE9] text-left">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Assignee & Workload Distribution</CardTitle>
            <CardDescription className="mt-0.5">
              Active queues, completed tickets, and capacity status per team member
            </CardDescription>
          </div>
          <Badge variant="default" size="sm">
            Capacity
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#102A2A] border-collapse">
            <thead className="bg-[#F3F9F7]/80 text-[11px] font-semibold uppercase tracking-wider text-[#6B7F7F] border-b border-[#E5EDE9]">
              <tr>
                <th className="py-3 px-5">Team Member</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Active Queue</th>
                <th className="py-3 px-4">Completed</th>
                <th className="py-3 px-4">Capacity Load</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EDE9]/70 bg-white">
              {data.map((item) => {
                const isOverloaded = item.capacityRate >= 80;
                return (
                  <tr
                    key={item.name}
                    className="hover:bg-[#F3F9F7]/50 transition-colors group"
                  >
                    {/* Member Name + Avatar */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={item.name}
                          size="xs"
                          className="bg-[#064747] text-white shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-xs text-[#102A2A] group-hover:text-[#063F3F] transition-colors truncate">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-[#6B7F7F] truncate">
                            {item.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F3F9F7] text-[#063F3F] border border-[#E5EDE9]">
                        {item.department}
                      </span>
                    </td>

                    {/* Active Queue */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#102A2A]">
                          {item.activeTickets}
                        </span>
                        {item.overdueTickets > 0 && (
                          <Badge variant="urgent" size="sm">
                            {item.overdueTickets} urgent
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Completed */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold text-[#10B981]">
                        {item.resolvedTickets} tickets
                      </span>
                    </td>

                    {/* Capacity Rate */}
                    <td className="py-3 px-4">
                      <div className="w-32 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span
                            className={`font-semibold ${
                              isOverloaded ? 'text-[#DC2626]' : 'text-[#063F3F]'
                            }`}
                          >
                            {item.capacityRate}%
                          </span>
                          <span className="text-[#6B7F7F]">
                            {isOverloaded ? 'Heavy load' : 'Optimal'}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            style={{ width: `${item.capacityRate}%` }}
                            className={`h-full rounded-full ${
                              isOverloaded ? 'bg-[#EF4444]' : 'bg-[#064747]'
                            }`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-5 text-right">
                      <Link
                        href={`/tickets?search=${encodeURIComponent(item.name)}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#063F3F] hover:underline"
                        title={`View tickets for ${item.name}`}
                      >
                        <span>Tickets</span>
                        <ArrowUpRightIcon size={12} className="text-[#6B7F7F]" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
