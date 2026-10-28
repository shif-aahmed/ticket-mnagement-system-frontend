'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { SettingsPreferencesSection } from '@/components/settings/settings-preferences-section';
import { SettingsNotificationsSection } from '@/components/settings/settings-notifications-section';
import { SettingsSecuritySection } from '@/components/settings/settings-security-section';
import { SettingsIcon, NotificationsIcon, LockIcon } from '@/components/ui/icons';

type SettingsTab = 'preferences' | 'notifications' | 'security';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('preferences');

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'preferences', label: 'Preferences & Display', icon: <SettingsIcon size={16} /> },
    { id: 'notifications', label: 'Notification Rules', icon: <NotificationsIcon size={16} /> },
    { id: 'security', label: 'Security & Password', icon: <LockIcon size={16} /> },
  ];

  return (
    <AppShell breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Settings' }]}>
      <div className="space-y-6 text-left">
        {/* Page Header */}
        <PageHeader
          title="Settings"
          description="Manage your interface preferences, notification triggers, and security options."
        />

        {/* Section Navigation Tabs */}
        <Card className="p-1.5 border-[#E5EDE9] bg-white">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#064747] text-white shadow-sm'
                    : 'text-[#6B7F7F] hover:text-[#102A2A] hover:bg-[#F3F9F7]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Active Section Content */}
        {activeTab === 'preferences' && <SettingsPreferencesSection />}
        {activeTab === 'notifications' && <SettingsNotificationsSection />}
        {activeTab === 'security' && <SettingsSecuritySection />}
      </div>
    </AppShell>
  );
}
