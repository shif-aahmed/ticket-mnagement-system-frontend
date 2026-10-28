'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from '@/components/ui/icons';

export interface PreferencesData {
  theme: 'system' | 'light' | 'dark';
  defaultLanding: string;
  tableDensity: 'comfortable' | 'compact';
  emailDigest: 'instant' | 'daily' | 'weekly' | 'off';
  autoRefreshInterval: string;
}

export const SettingsPreferencesSection = () => {
  const [preferences, setPreferences] = useState<PreferencesData>({
    theme: 'system',
    defaultLanding: '/dashboard',
    tableDensity: 'comfortable',
    emailDigest: 'daily',
    autoRefreshInterval: '30s',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <Card className="border-[#E5EDE9] bg-white text-left">
      <CardHeader className="pb-4 border-b border-[#F1F5F4]">
        <CardTitle>System & Display Preferences</CardTitle>
        <CardDescription className="mt-0.5">
          Customize your default navigation, visual density, and dashboard experience
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {savedSuccess && (
          <div className="p-3 rounded-lg bg-[#DDF4E9] border border-[#22C55E]/40 flex items-center gap-2 text-xs font-medium text-[#063F3F] animate-in fade-in">
            <CheckCircleIcon size={16} className="text-[#22C55E] shrink-0" />
            <span>Preferences saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Appearance / Theme Choice */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#102A2A]">
              Appearance & Color Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { id: 'system', title: 'System Default', desc: 'Sync with operating system scheme' },
                  { id: 'light', title: 'TicketGo Light', desc: 'Clean high-contrast mint theme' },
                  { id: 'dark', title: 'Dark Mode (Preview)', desc: 'Low-light nocturnal view' },
                ] as const
              ).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setPreferences({ ...preferences, theme: item.id })}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    preferences.theme === item.id
                      ? 'border-[#064747] bg-[#F3F9F7] ring-1 ring-[#064747]'
                      : 'border-[#E5EDE9] bg-white hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#102A2A]">{item.title}</span>
                    <input
                      type="radio"
                      name="theme"
                      checked={preferences.theme === item.id}
                      onChange={() => setPreferences({ ...preferences, theme: item.id })}
                      className="accent-[#064747]"
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7F7F] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Landing & Density */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="pref-landing"
              label="Default Landing Page"
              value={preferences.defaultLanding}
              onChange={(e) => setPreferences({ ...preferences, defaultLanding: e.target.value })}
              helperText="Initial view loaded when you sign in or open TicketGo"
            >
              <option value="/dashboard">Executive Dashboard (/dashboard)</option>
              <option value="/tickets">Unified Tickets Queue (/tickets)</option>
              <option value="/agent">Agent Workspace (/agent)</option>
              <option value="/employee">Employee Portal (/employee)</option>
              <option value="/knowledge-base">Knowledge Base (/knowledge-base)</option>
            </Select>

            <Select
              id="pref-density"
              label="Table & Queue Density"
              value={preferences.tableDensity}
              onChange={(e) =>
                setPreferences({ ...preferences, tableDensity: e.target.value as PreferencesData['tableDensity'] })
              }
              helperText="Vertical padding across ticket and inventory tables"
            >
              <option value="comfortable">Comfortable (Standard SaaS spacing)</option>
              <option value="compact">Compact (High-density records view)</option>
            </Select>
          </div>

          {/* Email Digest & Auto-Refresh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="pref-digest"
              label="Email Digest Summary"
              value={preferences.emailDigest}
              onChange={(e) =>
                setPreferences({ ...preferences, emailDigest: e.target.value as PreferencesData['emailDigest'] })
              }
              helperText="Cadence for organizational ticket activity summaries"
            >
              <option value="instant">Instant notifications (Immediate)</option>
              <option value="daily">Daily Morning Digest (Recommended)</option>
              <option value="weekly">Weekly Rollup</option>
              <option value="off">Off (In-app notification center only)</option>
            </Select>

            <Select
              id="pref-refresh"
              label="Queue Auto-Refresh Rate"
              value={preferences.autoRefreshInterval}
              onChange={(e) =>
                setPreferences({ ...preferences, autoRefreshInterval: e.target.value })
              }
              helperText="Background poll frequency for active ticket queues"
            >
              <option value="15s">Every 15 seconds</option>
              <option value="30s">Every 30 seconds</option>
              <option value="60s">Every 1 minute</option>
              <option value="manual">Manual refresh only</option>
            </Select>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-[#F1F5F4]">
            <Button type="submit" variant="primary" size="sm">
              Save Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
