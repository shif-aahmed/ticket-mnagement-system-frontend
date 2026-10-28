'use client';

import React from 'react';
import Link from 'next/link';
import { NotificationItem } from '@/types/notification';
import { Badge } from '@/components/ui/badge';
import {
  TicketsIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpRightIcon,
} from '@/components/ui/icons';

export interface NotificationItemCardProps {
  notification: NotificationItem;
  onToggleRead: (id: string) => void;
}

export const NotificationItemCard = ({
  notification,
  onToggleRead,
}: NotificationItemCardProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'ticket_assigned':
        return (
          <div className="h-8 w-8 rounded-full bg-[#EBF5EE] text-[#063F3F] flex items-center justify-center shrink-0">
            <TicketsIcon size={16} />
          </div>
        );
      case 'priority_changed':
        return (
          <div className="h-8 w-8 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
            <AlertCircleIcon size={16} />
          </div>
        );
      case 'status_changed':
        return (
          <div className="h-8 w-8 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0">
            <CheckCircleIcon size={16} />
          </div>
        );
      case 'due_date_approaching':
        return (
          <div className="h-8 w-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <ClockIcon size={16} />
          </div>
        );
      case 'ticket_overdue':
        return (
          <div className="h-8 w-8 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
            <AlertCircleIcon size={16} />
          </div>
        );
      case 'comment_added':
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
            <TicketsIcon size={16} />
          </div>
        );
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-150 text-left ${
        notification.isRead
          ? 'bg-white border-[#E5EDE9] opacity-85'
          : 'bg-[#F9FCFA] border-[#CDE5DB] border-l-4 border-l-[#064747] shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Left Icon */}
        {getIcon()}

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={`text-xs font-semibold ${
                  notification.isRead ? 'text-[#374949]' : 'text-[#102A2A]'
                }`}
              >
                {notification.title}
              </h4>
              {!notification.isRead && (
                <span className="h-2 w-2 rounded-full bg-[#064747]" title="Unread" />
              )}
              {notification.ticketId && (
                <Badge variant="neutral" size="sm">
                  {notification.ticketId}
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-[#6B7F7F] shrink-0">
              {notification.timestamp}
            </span>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed">
            {notification.message}
          </p>

          {/* Actor & Action Controls Row */}
          <div className="flex items-center justify-between pt-2 flex-wrap gap-2 text-[11px]">
            {notification.actor ? (
              <span className="text-[#6B7F7F]">
                By <strong className="text-[#102A2A] font-medium">{notification.actor.name}</strong>
                {notification.actor.role ? ` (${notification.actor.role})` : ''}
              </span>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleRead(notification.id)}
                className="text-xs text-[#063F3F] hover:text-[#064747] font-medium hover:underline cursor-pointer"
              >
                {notification.isRead ? 'Mark as unread' : 'Mark as read'}
              </button>

              {notification.ticketId && (
                <Link
                  href={`/tickets/${notification.ticketId}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-[#063F3F] bg-white border border-[#E5EDE9] hover:bg-[#F3F9F7] transition-colors"
                >
                  <span>View Ticket</span>
                  <ArrowUpRightIcon size={12} className="text-[#6B7F7F]" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
