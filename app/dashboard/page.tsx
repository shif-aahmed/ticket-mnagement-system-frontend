'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/ui/icons';
import { StatCard } from '@/components/dashboard/stat-card';
import { StatusOverview } from '@/components/dashboard/status-overview';
import { PriorityOverview } from '@/components/dashboard/priority-overview';
import { TicketTypeOverview } from '@/components/dashboard/ticket-type-overview';
import { DepartmentOverview } from '@/components/dashboard/department-overview';
import { RecentTickets } from '@/components/dashboard/recent-tickets';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { api } from '@/lib/api-client';

export default function DashboardPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [statusDist, setStatusDist] = useState<any[]>([]);
  const [priorityDist, setPriorityDist] = useState<any[]>([]);
  const [typeDist, setTypeDist] = useState<any[]>([]);
  const [deptDist, setDeptDist] = useState<any[]>([]);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.reports
      .dashboard()
      .then((data) => {
        if (!isMounted || !data) return;
        if (Array.isArray(data.stats) && data.stats.length > 0) {
          setStats(data.stats);
        }
        if (Array.isArray(data.statusDistribution)) {
          setStatusDist(data.statusDistribution);
        }
        if (Array.isArray(data.priorityDistribution)) {
          setPriorityDist(data.priorityDistribution);
        }
        if (Array.isArray(data.ticketTypeDistribution)) {
          setTypeDist(data.ticketTypeDistribution);
        }
        if (Array.isArray(data.departmentDistribution)) {
          setDeptDist(data.departmentDistribution);
        }
        if (Array.isArray(data.recentTickets)) {
          setRecentTickets(data.recentTickets);
        }
        if (Array.isArray(data.recentActivities)) {
          setRecentActivities(data.recentActivities);
        }
      })
      .catch((err: any) => {
        if (isMounted) setLoadError(err.message || 'Failed to load dashboard data.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppShell
      title="Dashboard"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Dashboard' },
      ]}
    >
      {/* 1. Page Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of cross-functional work, operational tickets, and queue health."
        actions={
          <Link href="/tickets/create">
            <Button variant="primary" size="md" leftIcon={<PlusIcon size={16} />}>
              Create Ticket
            </Button>
          </Link>
        }
      />

      <div className="space-y-6">
        {/* Loading State */}
        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#6B7F7F] font-medium">Loading dashboard...</p>
            </div>
          </div>
        ) : loadError ? (
          <div className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="h-10 w-10 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center border border-[#FECACA]">⚠</div>
              <p className="text-sm font-semibold text-[#102A2A]">Failed to load dashboard</p>
              <p className="text-xs text-[#6B7F7F]">{loadError}</p>
            </div>
          </div>
        ) : (
        <>
        {/* 2. Key Statistics Grid (6 Cards) */}
        <section aria-label="Key Statistics">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 md:gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </section>

        {/* 3. Work Types & Department Distribution */}
        <section aria-label="Work & Department Distribution">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <TicketTypeOverview
              data={typeDist}
              className="lg:col-span-7"
            />
            <DepartmentOverview
              data={deptDist}
              className="lg:col-span-5"
            />
          </div>
        </section>

        {/* 4. Ticket Status & Priority Overview */}
        <section aria-label="Distribution Overviews">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <StatusOverview
              data={statusDist}
              className="lg:col-span-7"
            />
            <PriorityOverview
              data={priorityDist}
              className="lg:col-span-5"
            />
          </div>
        </section>

        {/* 5 & 6. Recent Tickets & Recent Activity */}
        <section aria-label="Recent Tickets and Activity">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <RecentTickets
              tickets={recentTickets}
              className="lg:col-span-8"
            />
            <RecentActivity
              activities={recentActivities}
              className="lg:col-span-4"
            />
          </div>
        </section>
        </>
        )}
      </div>
    </AppShell>
  );
}
