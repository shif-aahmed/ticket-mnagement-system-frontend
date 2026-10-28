'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlusIcon } from '@/components/ui/icons';
import { EmployeeSummary } from '@/components/employee/employee-summary';
import {
  EmployeeTicketFilters,
  EmployeeTabValue,
  EmployeeScopeValue,
} from '@/components/employee/employee-ticket-filters';
import { EmployeeTicketTable } from '@/components/employee/employee-ticket-table';
import { EmployeeTicketCard } from '@/components/employee/employee-ticket-card';
import { EmployeeStatusOverview } from '@/components/employee/employee-status-overview';
import { TicketPagination } from '@/components/tickets/ticket-pagination';
import { TicketEmptyState } from '@/components/tickets/ticket-empty-state';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Ticket, TicketPriority, TicketStatus, TicketType } from '@/types/ticket';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';

const PAGE_SIZE = 5;

export default function EmployeeSupportPortalPage() {
  const { user: currentUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<EmployeeTabValue>('all');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TicketStatus | 'all'>('all');
  const [priority, setPriority] = useState<TicketPriority | 'all'>('all');
  const [scope, setScope] = useState<EmployeeScopeValue>('all');
  const [type, setType] = useState<TicketType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const [ticketsRes, dashRes] = await Promise.allSettled([
        api.tickets.list({ limit: 100 }),
        api.reports.dashboard(),
      ]);

      if (ticketsRes.status === 'fulfilled') {
        const res = ticketsRes.value;
        const raw = res?.items || res?.tickets || (Array.isArray(res) ? res : []);
        const mapped: Ticket[] = raw.map((t: any) => ({
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
        setTickets(mapped);
      } else {
        setLoadError('Failed to load employee tickets.');
      }

      if (dashRes.status === 'fulfilled' && dashRes.value && Array.isArray(dashRes.value.recentActivities)) {
        setRecentActivities(dashRes.value.recentActivities);
      }
    } catch (err: any) {
      setLoadError(err.message || 'Failed to fetch tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Sync active tab with status filter
  const handleTabChange = (newTab: EmployeeTabValue) => {
    setActiveTab(newTab);
    setStatus(newTab === 'all' ? 'all' : newTab);
    setCurrentPage(1);
  };

  // When status dropdown is changed, update activeTab if matched
  const handleStatusChange = (newStatus: TicketStatus | 'all') => {
    setStatus(newStatus);
    if (newStatus === 'all') {
      setActiveTab('all');
    } else if (
      newStatus === 'open' ||
      newStatus === 'in_progress' ||
      newStatus === 'pending' ||
      newStatus === 'resolved'
    ) {
      setActiveTab(newStatus);
    } else {
      setActiveTab('all');
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  const handlePriorityChange = (newPriority: TicketPriority | 'all') => {
    setPriority(newPriority);
    setCurrentPage(1);
  };

  const handleScopeChange = (newScope: EmployeeScopeValue) => {
    setScope(newScope);
    setCurrentPage(1);
  };

  const handleTypeChange = (newType: TicketType | 'all') => {
    setType(newType);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setActiveTab('all');
    setStatus('all');
    setPriority('all');
    setScope('all');
    setType('all');
    setCurrentPage(1);
  };

  // Tab counts based on all employee tickets
  const tabCounts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter((t) => t.status === 'open').length,
      in_progress: tickets.filter((t) => t.status === 'in_progress').length,
      pending: tickets.filter((t) => t.status === 'pending').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
    };
  }, [tickets]);

  // Client-side filtering
  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      // 1. Search filter (Ticket ID or Subject)
      if (q) {
        const matchesId = ticket.id.toLowerCase().includes(q);
        const matchesSubject = ticket.subject.toLowerCase().includes(q);
        if (!matchesId && !matchesSubject) {
          return false;
        }
      }

      // 2. Status match (Dropdown & Tab synced)
      if (status !== 'all' && ticket.status !== status) {
        return false;
      }

      // 3. Priority match
      if (priority !== 'all' && ticket.priority !== priority) {
        return false;
      }

      // 4. Scope match (All, Submitted by Me, Assigned to Me)
      if (scope === 'submitted') {
        const isSubmitted =
          ticket.requester.name === currentUser?.name ||
          ticket.requester.email === currentUser?.email;
        if (!isSubmitted) return false;
      } else if (scope === 'assigned') {
        const isAssigned =
          ticket.assignee.name === currentUser?.name ||
          ticket.assignee.email === currentUser?.email;
        if (!isAssigned) return false;
      }

      // 5. Type match
      if (type !== 'all' && ticket.type !== type) {
        return false;
      }

      return true;
    });
  }, [tickets, search, status, priority, scope, type, currentUser]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTickets.length / PAGE_SIZE) || 1;
  const paginatedTickets = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return filteredTickets.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredTickets, currentPage]);

  const isFiltered =
    search.trim() !== '' ||
    activeTab !== 'all' ||
    status !== 'all' ||
    priority !== 'all' ||
    scope !== 'all' ||
    type !== 'all';

  return (
    <AppShell breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Employee Portal' }]}>
      <div className="space-y-6 text-left">
        {/* Page Header */}
        <PageHeader
          title="Employee Support Portal"
          description="Submit new service requests, check real-time resolution status, and access team assistance."
          actions={
            <Link href="/tickets/create">
              <Button variant="primary" size="md" leftIcon={<PlusIcon size={16} />}>
                Create Ticket
              </Button>
            </Link>
          }
        />

        {/* 1. Summary Metrics Strip */}
        <EmployeeSummary tickets={tickets} />

        {/* 2. Employee Profile Context Card */}
        <Card className="border-[#E5EDE9] bg-gradient-to-r from-white via-white to-[#F3F9F7]">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Avatar
                name={currentUser?.name || 'Employee'}
                src={currentUser?.avatarUrl}
                size="md"
                className="bg-[#064747] text-white shrink-0"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#102A2A]">
                    {currentUser?.name || 'Employee Portal'}
                  </h3>
                  <Badge variant="active" size="sm">
                    {currentUser?.department || 'Operations'}
                  </Badge>
                </div>
                <p className="text-xs text-[#6B7F7F]">
                  {currentUser?.email || 'user@ticketgo.io'} &bull; Role:{' '}
                  <span className="capitalize">{currentUser?.role || 'employee'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link href="/knowledge-base">
                <Button variant="outline" size="sm">
                  Search Knowledge Base
                </Button>
              </Link>
              <Link href="/tickets/create">
                <Button variant="primary" size="sm" leftIcon={<PlusIcon size={14} />}>
                  New Request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 3. My Tickets Workspace (Primary Section) */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-[#E5EDE9] pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base">My Tickets & Assigned Work</CardTitle>
                <CardDescription className="mt-0.5">
                  Track progress, view updates, and follow up on requests and tasks
                </CardDescription>
              </div>
              <span className="text-xs font-semibold text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded-full border border-[#BBF7D0] self-start sm:self-auto">
                {tickets.length} Total Items
              </span>
            </div>

            {/* Tabs & Filter Toolbar */}
            <div className="pt-3">
              <EmployeeTicketFilters
                search={search}
                tab={activeTab}
                status={status}
                priority={priority}
                scope={scope}
                type={type}
                onSearchChange={handleSearchChange}
                onTabChange={handleTabChange}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                onScopeChange={handleScopeChange}
                onTypeChange={handleTypeChange}
                onClearFilters={handleClearFilters}
                tabCounts={tabCounts}
                resultCount={filteredTickets.length}
                totalCount={tickets.length}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading && tickets.length === 0 ? (
              <div className="py-12 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-[#6B7F7F] font-medium">Loading tickets...</p>
                </div>
              </div>
            ) : loadError ? (
              <div className="py-12 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center px-4">
                  <div className="h-10 w-10 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center border border-[#FECACA]">⚠</div>
                  <p className="text-sm font-semibold text-[#102A2A]">Failed to load tickets</p>
                  <p className="text-xs text-[#6B7F7F]">{loadError}</p>
                </div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-6">
                <TicketEmptyState
                  onClearFilters={handleClearFilters}
                  isFiltered={isFiltered}
                />
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <EmployeeTicketTable tickets={paginatedTickets} />

                {/* Mobile Stacked Cards */}
                <div className="md:hidden p-4 space-y-3">
                  {paginatedTickets.map((ticket) => (
                    <EmployeeTicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>

                {/* Pagination */}
                {filteredTickets.length > PAGE_SIZE && (
                  <TicketPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={filteredTickets.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* 4. Ticket Status + Recent Activity (Side-by-side on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Overview */}
          <EmployeeStatusOverview
            tickets={tickets}
            onSelectStatus={(st) => handleTabChange(st)}
          />

          {/* Recent Activity */}
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </AppShell>
  );
}
