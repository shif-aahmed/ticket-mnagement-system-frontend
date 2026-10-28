'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from '@/components/ui/icons';

export interface NotificationSettingItem {
  id: string;
  title: string;
  description: string;
  inApp: boolean;
  email: boolean;
}

const initialNotificationSettings: NotificationSettingItem[] = [
  {
    id: 'ticket_assigned',
    title: 'Ticket Assignment',
    description: 'When an agent, supervisor, or automated routing rule assigns a ticket to you.',
    inApp: true,
    email: true,
  },
  {
    id: 'status_changes',
    title: 'Status & State Changes',
    description: 'When tickets you requested or are assigned to change status (e.g. Open to In Progress or Resolved).',
    inApp: true,
    email: true,
  },
  {
    id: 'comments_activity',
    title: 'Comments & Mentions',
    description: 'When team members comment on your tickets or tag your username with @.',
    inApp: true,
    email: false,
  },
  {
    id: 'due_date_reminders',
    title: 'Approaching Due Dates',
    description: 'Reminders 24 hours and 2 hours prior to a ticket target due date.',
    inApp: true,
    email: true,
  },
  {
    id: 'overdue_alerts',
    title: 'SLA Overdue Escalations',
    description: 'Immediate alert when a critical incident or ticket breaches enterprise SLA targets.',
    inApp: true,
    email: true,
  },
];

export const SettingsNotificationsSection = () => {
  const [settings, setSettings] = useState<NotificationSettingItem[]>(initialNotificationSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleSetting = (id: string, channel: 'inApp' | 'email') => {
    setSettings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [channel]: !item[channel] } : item
      )
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <Card className="border-[#E5EDE9] bg-white text-left">
      <CardHeader className="pb-4 border-b border-[#F1F5F4]">
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription className="mt-0.5">
          Configure which events trigger in-app notification center items and email alerts
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {savedSuccess && (
          <div className="p-3 rounded-lg bg-[#DDF4E9] border border-[#22C55E]/40 flex items-center gap-2 text-xs font-medium text-[#063F3F] animate-in fade-in">
            <CheckCircleIcon size={16} className="text-[#22C55E] shrink-0" />
            <span>Notification rules updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="divide-y divide-[#F1F5F4]">
            {settings.map((item) => (
              <div
                key={item.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-0.5 max-w-lg">
                  <h4 className="text-xs font-semibold text-[#102A2A]">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7F7F] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Toggle Checkboxes */}
                <div className="flex items-center gap-6 shrink-0 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={item.inApp}
                      onChange={() => toggleSetting(item.id, 'inApp')}
                      className="h-4 w-4 rounded border-[#CBD5E1] text-[#064747] accent-[#064747] focus:ring-[#064747]"
                    />
                    <span className="text-[#102A2A] font-medium">In-App</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={item.email}
                      onChange={() => toggleSetting(item.id, 'email')}
                      className="h-4 w-4 rounded border-[#CBD5E1] text-[#064747] accent-[#064747] focus:ring-[#064747]"
                    />
                    <span className="text-[#102A2A] font-medium">Email</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-[#F1F5F4]">
            <Button type="submit" variant="primary" size="sm">
              Save Notification Rules
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
