'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { NotificationItem } from '@/types/notification';
import { IconButton } from '@/components/ui/icon-button';
import { Badge } from '@/components/ui/badge';
import { NotificationsIcon, ArrowUpRightIcon } from '@/components/ui/icons';

export interface TopbarNotificationsPopoverProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onToggleRead: (id: string) => void;
}

export const TopbarNotificationsPopover = ({
  notifications,
  onMarkAllAsRead,
  onToggleRead,
}: TopbarNotificationsPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 4);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={popoverRef} className="relative">
      {/* Bell Trigger Button */}
      <IconButton
        variant="outline"
        size="md"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-[#6B7F7F] hover:text-[#102A2A] relative cursor-pointer"
      >
        <NotificationsIcon size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </IconButton>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          role="region"
          aria-label="Notifications preview"
          className="absolute right-0 top-11 z-50 w-80 sm:w-96 bg-white border border-[#E5EDE9] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5EDE9] bg-[#FAFDFC]">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#102A2A]">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="urgent" size="sm">
                  {unreadCount} new
                </Badge>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-[11px] text-[#063F3F] hover:underline font-medium cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List of Recent Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F5F4]">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 text-xs space-y-1 transition-colors hover:bg-[#F3F9F7]/60 ${
                    !item.isRead ? 'bg-[#F9FCFA]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`font-semibold ${
                          !item.isRead ? 'text-[#102A2A]' : 'text-[#475569]'
                        }`}
                      >
                        {item.title}
                      </span>
                      {!item.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#064747]" />
                      )}
                    </div>
                    <span className="text-[10px] text-[#6B7F7F] shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6B7F7F] line-clamp-2">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    {item.ticketId ? (
                      <Link
                        href={`/tickets/${item.ticketId}`}
                        onClick={() => {
                          onToggleRead(item.id);
                          setIsOpen(false);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-[#063F3F] font-medium hover:underline"
                      >
                        <span>{item.ticketId}</span>
                        <ArrowUpRightIcon size={11} />
                      </Link>
                    ) : (
                      <span />
                    )}

                    {!item.isRead && (
                      <button
                        type="button"
                        onClick={() => onToggleRead(item.id)}
                        className="text-[10px] text-[#6B7F7F] hover:text-[#102A2A]"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#6B7F7F]">
                No notifications right now.
              </div>
            )}
          </div>

          {/* Footer link to full notification center */}
          <div className="p-2.5 bg-[#FAFDFC] border-t border-[#E5EDE9] text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#063F3F] hover:underline"
            >
              <span>View all notifications</span>
              <ArrowUpRightIcon size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
