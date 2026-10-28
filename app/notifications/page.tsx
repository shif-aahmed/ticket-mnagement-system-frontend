'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircleIcon, NotificationsIcon, CheckIcon } from '@/components/ui/icons';
import { NotificationItem, NotificationType } from '@/types/notification';
import { NotificationItemCard } from '@/components/notifications/notification-item-card';
import { api } from '@/lib/api-client';

const typeOptions: { value: 'all' | NotificationType; label: string }[] = [
  { value: 'all', label: 'All Event Types' },
  { value: 'ticket_assigned', label: 'Ticket Assignments' },
  { value: 'status_changed', label: 'Status Updates' },
  { value: 'priority_changed', label: 'Priority Escalations' },
  { value: 'comment_added', label: 'Comments & Activity' },
  { value: 'due_date_approaching', label: 'Due Date Approaching' },
  { value: 'ticket_overdue', label: 'SLA Overdue Alerts' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | NotificationType>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await api.notifications.list({ limit: 50 });
      const raw = res?.items || res?.notifications || (Array.isArray(res) ? res : null);
      if (Array.isArray(raw) && raw.length > 0) {
        const mapped: NotificationItem[] = raw.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: (n.type?.toLowerCase() as NotificationType) || 'status_changed',
          isRead: Boolean(n.read || n.isRead),
          timestamp: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recently',
          ticketId: n.ticket?.key || n.ticketId,
          ticketKey: n.ticket?.key || n.ticketId,
          actor: n.actor
            ? {
                name: n.actor.name,
                email: n.actor.email,
                avatarUrl: n.actor.avatarUrl,
              }
            : undefined,
        }));
        setNotifications(mapped);
      }
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Toggle single read status
  const handleToggleRead = async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    const nextRead = !target?.isRead;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: nextRead } : n))
    );

    if (nextRead) {
      try {
        await api.notifications.markRead(id);
        window.dispatchEvent(new Event('ticketgo:refresh-counts'));
      } catch (e) {
        console.warn('Failed to mark read on server:', e);
      }
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    if (unreadCount === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.notifications.markAllRead();
      window.dispatchEvent(new Event('ticketgo:refresh-counts'));
    } catch (e) {
      console.warn('Failed to mark all read on server:', e);
    }
    setToastMessage(`Marked ${unreadCount} notification${unreadCount === 1 ? '' : 's'} as read.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (tab === 'unread' && item.isRead) {
        return false;
      }
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }
      return true;
    });
  }, [notifications, tab, typeFilter]);

  const unreadTotal = notifications.filter((n) => !n.isRead).length;

  return (
    <AppShell breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Notifications' }]}>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-[#063F3F] text-white text-xs font-medium rounded-lg shadow-xl border border-[#0F766E] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircleIcon size={16} className="text-[#22C55E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Notifications"
          description="Stay informed on ticket assignments, status changes, priority alerts, and comments."
          actions={
            unreadTotal > 0 ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<CheckIcon size={14} />}
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            ) : undefined
          }
        />

        {/* Tab & Type Filters Bar */}
        <Card className="p-3 border-[#E5EDE9]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F3F9F7] rounded-lg border border-[#E5EDE9] self-start">
              <button
                type="button"
                onClick={() => setTab('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
                  tab === 'all'
                    ? 'bg-white text-[#063F3F] shadow-sm'
                    : 'text-[#6B7F7F] hover:text-[#102A2A]'
                }`}
              >
                <span>All Notifications</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E5EDE9] text-[#102A2A]">
                  {notifications.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTab('unread')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
                  tab === 'unread'
                    ? 'bg-white text-[#063F3F] shadow-sm'
                    : 'text-[#6B7F7F] hover:text-[#102A2A]'
                }`}
              >
                <span>Unread</span>
                {unreadTotal > 0 && (
                  <Badge variant="urgent" size="sm">
                    {unreadTotal}
                  </Badge>
                )}
              </button>
            </div>

            {/* Type Filter Dropdown */}
            <div className="w-full sm:w-64">
              <Select
                id="notification-type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | NotificationType)}
                aria-label="Filter by notification type"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((item) => (
              <NotificationItemCard
                key={item.id}
                notification={item}
                onToggleRead={handleToggleRead}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="p-12 text-center border-dashed border-[#CBD5E1] bg-white">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#F3F9F7] flex items-center justify-center text-[#063F3F]">
                <NotificationsIcon size={24} />
              </div>
              <h3 className="text-sm font-semibold text-[#102A2A]">
                {tab === 'unread' ? "You're all caught up!" : 'No notifications found'}
              </h3>
              <p className="text-xs text-[#6B7F7F]">
                {tab === 'unread'
                  ? 'There are no unread notifications matching your current filter criteria.'
                  : 'No notification records match the selected event type.'}
              </p>
              {(tab !== 'all' || typeFilter !== 'all') && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTab('all');
                      setTypeFilter('all');
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
