'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import { UserProfile } from '@/types/user';
import { Ticket } from '@/types/ticket';
import { DEFAULT_PREVIEW_USER } from '@/lib/navigation-config';
import { ProfileHeaderCard } from '@/components/profile/profile-header-card';
import { ProfileStatsCard } from '@/components/profile/profile-stats-card';
import { ProfileForm } from '@/components/profile/profile-form';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';

export default function ProfilePage() {
  const { user: authUser, refreshUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserProfile>(authUser || DEFAULT_PREVIEW_USER);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    let mounted = true;
    api.tickets
      .list({ limit: 50 })
      .then((res: any) => {
        if (!mounted) return;
        const list = res?.items || res?.tickets || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(list) && list.length > 0) {
          const mapped: Ticket[] = list.map((item: any) => ({
            id: item.code || item.id,
            subject: item.subject,
            description: item.description || '',
            status: item.status,
            priority: item.priority,
            type: item.type,
            department: item.department || 'General',
            category: item.category?.name || 'General',
            requester: {
              name: item.requester?.name || 'Unknown',
              email: item.requester?.email || '',
              avatarUrl: item.requester?.avatarUrl,
            },
            assignee: {
              name: item.assignee?.name || 'Unassigned',
              email: item.assignee?.email || '',
              avatarUrl: item.assignee?.avatarUrl,
            },
            createdAt: item.createdAt,
            updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'recently',
          }));
          setTickets(mapped);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const handleProfileSave = async (updated: UserProfile) => {
    if (updated.id) {
      await api.users.update(updated.id, {
        name: updated.name,
        title: updated.title,
        phone: updated.phone,
        bio: updated.bio,
        department: updated.department,
      });
      await refreshUser();
    }
    setCurrentUser(updated);
  };

  // Tickets assigned to this user
  const assignedTickets = tickets.filter(
    (t) =>
      t.assignee.name.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      t.requester.name.toLowerCase().includes(currentUser.name.toLowerCase())
  ).slice(0, 4);

  return (
    <AppShell breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'My Profile' }]}>
      <div className="space-y-6 text-left">
        {/* Page Header */}
        <PageHeader
          title="My Profile"
          description="View and manage your personal account identity, organizational role, and ticket workload."
        />

        {/* 1. Header Card */}
        <ProfileHeaderCard user={currentUser} />

        {/* 2. Personal Workload Statistics */}
        <ProfileStatsCard
          userName={currentUser.name}
          tickets={tickets}
        />

        {/* 3. Editable Personal Information */}
        <ProfileForm
          user={currentUser}
          onSave={handleProfileSave}
        />

        {/* 4. Recent Assigned Tickets Preview */}
        <Card className="border-[#E5EDE9] bg-white">
          <CardHeader className="pb-3 border-b border-[#F1F5F4]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Assigned Activity</CardTitle>
                <CardDescription className="mt-0.5">
                  Recent tickets assigned to your queue or requested by you
                </CardDescription>
              </div>

              <Link
                href={`/tickets?search=${encodeURIComponent(currentUser.name)}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#063F3F] hover:underline"
              >
                <span>View all tickets</span>
                <ArrowUpRightIcon size={12} />
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-[#F1F5F4]">
            {assignedTickets.length > 0 ? (
              assignedTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-[#FAFDFC] transition-colors"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#063F3F]">
                        {t.id}
                      </span>
                      <h4 className="text-xs font-semibold text-[#102A2A] truncate">
                        {t.subject}
                      </h4>
                      <Badge variant="neutral" size="sm">
                        {t.department || 'Engineering'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#6B7F7F]">
                      <span>Priority: <strong className="text-[#102A2A] capitalize">{t.priority}</strong></span>
                      <span>•</span>
                      <span>Status: <strong className="text-[#102A2A] capitalize">{t.status.replace('_', ' ')}</strong></span>
                      <span>•</span>
                      <span>Updated {t.updatedAt}</span>
                    </div>
                  </div>

                  <Link
                    href={`/tickets/${t.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#063F3F] bg-white border border-[#E5EDE9] rounded-md hover:bg-[#F3F9F7] transition-colors shrink-0"
                  >
                    <span>Open</span>
                    <ArrowUpRightIcon size={12} className="text-[#6B7F7F]" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#6B7F7F]">
                No recently assigned tickets found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
