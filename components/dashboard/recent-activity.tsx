import React from 'react';
import Link from 'next/link';
import { RecentActivity as RecentActivityType } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ClockIcon } from '@/components/ui/icons';

export interface RecentActivityProps {
  activities: RecentActivityType[];
  className?: string;
}

export const RecentActivity = ({ activities, className = '' }: RecentActivityProps) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3 border-b border-[#E5EDE9]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription className="mt-1">
              Live audit events and operational updates
            </CardDescription>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488] animate-pulse" />
            Live
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-[#E5EDE9]/70">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 flex items-start gap-3 hover:bg-[#F3F9F7]/40 transition-colors"
            >
              <Avatar
                name={activity.actor.name}
                size="xs"
                className="mt-0.5 shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs text-[#102A2A] leading-relaxed">
                  <span className="font-semibold text-[#102A2A]">
                    {activity.actor.name}
                  </span>{' '}
                  <span className="text-[#6B7F7F]">{activity.description}</span>
                  {activity.ticketId && (
                    <Link
                      href="/tickets"
                      className="ml-1 inline-flex font-mono text-[11px] font-semibold text-[#063F3F] bg-[#DDF4E9] px-1.5 py-0.2 rounded border border-[#BBF7D0] hover:underline"
                    >
                      {activity.ticketId}
                    </Link>
                  )}
                </p>

                <div className="flex items-center gap-1 text-[11px] text-[#6B7F7F]">
                  <ClockIcon size={11} className="shrink-0" />
                  <span>{activity.timestamp}</span>
                  {activity.actor.role && (
                    <>
                      <span>•</span>
                      <span className="text-[#6B7F7F]">{activity.actor.role}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
