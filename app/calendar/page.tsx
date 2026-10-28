'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@/components/ui/icons';
import { Ticket } from '@/types/ticket';
import { CalendarFiltersState } from '@/types/calendar';
import {
  filterCalendarTickets,
  generateMonthMatrix,
  calculateUpcomingDeadlines,
  calculateOverdueDeadlines,
} from '@/lib/calendar-utils';
import { CalendarFilters } from '@/components/calendar/calendar-filters';
import { CalendarMonthView } from '@/components/calendar/calendar-month-view';
import { CalendarDeadlineSummary } from '@/components/calendar/calendar-deadline-summary';
import { api } from '@/lib/api-client';

const initialFilters: CalendarFiltersState = {
  department: 'all',
  status: 'all',
  priority: 'all',
  type: 'all',
  assignee: 'all',
};

export default function CalendarPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assignees, setAssignees] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState<CalendarFiltersState>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize view to today's date
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  useEffect(() => {
    let mounted = true;
    async function loadCalendarData() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [ticketsRes, usersRes] = await Promise.allSettled([
          api.tickets.list({ limit: 100 }),
          api.users.list({ limit: 100 }),
        ]);

        if (!mounted) return;

        if (usersRes.status === 'fulfilled') {
          const uVal = usersRes.value;
          const uList = Array.isArray(uVal) ? uVal : uVal?.items || uVal?.users || [];
          if (Array.isArray(uList)) {
            setAssignees(uList.map((u: any) => ({ id: u.id, name: u.name })));
          }
        }

        if (ticketsRes.status === 'fulfilled') {
          const res = ticketsRes.value;
          const raw = res?.items || res?.tickets || (Array.isArray(res) ? res : []);
          const mappedTickets: Ticket[] = raw.map((t: any) => ({
            id: t.code || t.id,
            subject: t.subject,
            description: t.description,
            type: t.type,
            department: t.department || 'Engineering',
            project: t.project,
            dueDate: t.dueDate,
            category: t.category?.name || t.categoryId,
            priority: t.priority,
            status: t.status,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            requester: {
              name: t.requester?.name || 'Requester',
              email: t.requester?.email || '',
              avatarUrl: t.requester?.avatarUrl,
            },
            assignee: {
              name: t.assignee?.name || 'Unassigned',
              email: t.assignee?.email || '',
              avatarUrl: t.assignee?.avatarUrl,
            },
          }));
          setTickets(mappedTickets);
        } else {
          setLoadError('Failed to load tickets for calendar.');
        }
      } catch (err: any) {
        if (mounted) {
          setLoadError(err.message || 'Failed to load calendar data.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }
    loadCalendarData();
    return () => {
      mounted = false;
    };
  }, []);

  // Count total scheduled tickets (excluding completed or no dueDate)
  const totalScheduledCount = useMemo(() => {
    return tickets.filter(
      (t) => t.dueDate && t.dueDate.toLowerCase() !== 'completed'
    ).length;
  }, [tickets]);

  // Filter tickets dynamically
  const filteredTickets = useMemo(() => {
    return filterCalendarTickets(tickets, filters);
  }, [tickets, filters]);

  // Generate 7-column calendar matrix
  const matrix = useMemo(() => {
    return generateMonthMatrix(currentYear, currentMonth, filteredTickets, today);
  }, [currentYear, currentMonth, filteredTickets, today]);

  // Upcoming deliverables
  const upcomingItems = useMemo(() => {
    return calculateUpcomingDeadlines(filteredTickets, today);
  }, [filteredTickets, today]);

  // Overdue deliverables
  const overdueItems = useMemo(() => {
    return calculateOverdueDeadlines(filteredTickets, today);
  }, [filteredTickets, today]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Deliverables Calendar"
          description="Visualize scheduled delivery timelines, SLA deadlines, and upcoming work across teams."
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Calendar' },
          ]}
          actions={
            <Link href="/tickets/create">
              <Button variant="primary" size="sm" className="h-9">
                <PlusIcon size={16} className="mr-1.5" />
                Create Ticket
              </Button>
            </Link>
          }
        />

        {/* 1. Local Filters */}
        <CalendarFilters
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          filteredCount={filteredTickets.length}
          totalScheduledCount={totalScheduledCount}
          assignees={assignees}
        />

        {/* Loading / Error / Calendar View */}
        {isLoading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#6B7F7F] font-medium">Loading calendar...</p>
            </div>
          </div>
        ) : loadError ? (
          <div className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="h-10 w-10 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center border border-[#FECACA]">⚠</div>
              <p className="text-sm font-semibold text-[#102A2A]">Failed to load calendar</p>
              <p className="text-xs text-[#6B7F7F]">{loadError}</p>
            </div>
          </div>
        ) : (
          <>
            {/* 2. Month Calendar Grid */}
            <CalendarMonthView
              currentYear={currentYear}
              currentMonth={currentMonth}
              matrix={matrix}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
            />

            {/* 3. Upcoming & Overdue Deadline Summaries */}
            <CalendarDeadlineSummary
              overdueItems={overdueItems}
              upcomingItems={upcomingItems}
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
