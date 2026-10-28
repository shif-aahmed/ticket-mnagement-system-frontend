'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircleIcon, XIcon } from '@/components/ui/icons';
import { AgentSummary } from '@/components/agent/agent-summary';
import { AgentTicketFilters } from '@/components/agent/agent-ticket-filters';
import { AgentTicketTable } from '@/components/agent/agent-ticket-table';
import { AgentWorkloadBreakdown } from '@/components/agent/agent-workload-breakdown';
import { TicketMobileCard } from '@/components/tickets/ticket-mobile-card';
import { TicketEmptyState } from '@/components/tickets/ticket-empty-state';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Ticket, TicketPriority, TicketStatus } from '@/types/ticket';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';

export default function AgentWorkspacePage() {
  const { user: currentUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TicketStatus | 'all'>('all');
  const [priority, setPriority] = useState<TicketPriority | 'all'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAgentTickets = useCallback(async () => {
    try {
      setLoading(true);
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
      }

      if (dashRes.status === 'fulfilled' && dashRes.value && Array.isArray(dashRes.value.recentActivities)) {
        setRecentActivities(dashRes.value.recentActivities);
      }
    } catch (err: any) {
      setToastMessage(`Error: Failed to load tickets — ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgentTickets();
  }, [fetchAgentTickets]);

  // Auto-dismiss confirmation toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Agent assignment handler
  const handleAssignAgent = async (
    ticketId: string,
    assignee: { id: string; name: string; email: string }
  ) => {
    const assigneeId = assignee.id === 'unassigned' ? undefined : assignee.id;
    try {
      await api.tickets.assign(ticketId, assigneeId);
      await fetchAgentTickets();
      const agentLabel = assignee.id === 'unassigned' ? 'Unassigned' : assignee.name;
      setToastMessage(`Assigned ${ticketId} to ${agentLabel}`);
    } catch (err: any) {
      setToastMessage(`Error: Failed to assign ticket — ${err.message || 'Unknown error'}`);
    }
  };

  // Status change handler
  const handleChangeStatus = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      await api.tickets.updateStatus(ticketId, newStatus);
      await fetchAgentTickets();
      const statusLabel = newStatus.replace('_', ' ');
      setToastMessage(`Updated ${ticketId} status to "${statusLabel}"`);
    } catch (err: any) {
      setToastMessage(`Error: Failed to update status — ${err.message || 'Unknown error'}`);
    }
  };

  // Client-side filtering
  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      // 1. Search match (id, subject, or requester)
      if (q) {
        const matchesId = ticket.id.toLowerCase().includes(q);
        const matchesSubject = ticket.subject.toLowerCase().includes(q);
        const matchesRequester = ticket.requester.name.toLowerCase().includes(q);
        if (!matchesId && !matchesSubject && !matchesRequester) {
          return false;
        }
      }

      // 2. Status match
      if (status !== 'all' && ticket.status !== status) {
        return false;
      }

      // 3. Priority match
      if (priority !== 'all' && ticket.priority !== priority) {
        return false;
      }

      return true;
    });
  }, [tickets, search, status, priority]);

  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
    setPriority('all');
  };

  const isFiltered = search.trim() !== '' || status !== 'all' || priority !== 'all';

  return (
    <AppShell breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Agent Workspace' }]}>
      <div className="space-y-6 text-left">
        {/* Page Header */}
        <PageHeader
          title="Agent Workspace"
          description="Dedicated triage and execution dashboard for handling assigned tickets, updating work statuses, and monitoring response times."
        />

        {/* 1. Agent Queue Summary */}
        <AgentSummary tickets={tickets} />

        {/* 2. My Queue Workspace (Table & Filters) */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-[#E5EDE9] pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base">Assigned Ticket Queue</CardTitle>
                <CardDescription className="mt-0.5">
                  Direct workload assigned to{' '}
                  <span className="text-xs font-semibold text-[#102A2A]">
                    {currentUser?.name || 'Agent'}
                  </span>
                </CardDescription>
              </div>
              <span className="text-xs font-semibold text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded-full border border-[#BBF7D0] self-start sm:self-auto">
                {tickets.length} Assigned Queue
              </span>
            </div>

            {/* Filter Toolbar */}
            <div className="pt-3">
              <AgentTicketFilters
                search={search}
                status={status}
                priority={priority}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onPriorityChange={setPriority}
                onClearFilters={handleClearFilters}
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
                  <p className="text-sm text-[#6B7F7F] font-medium">Loading assigned tickets...</p>
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
                <AgentTicketTable
                  tickets={filteredTickets}
                  onAssignAgent={handleAssignAgent}
                  onChangeStatus={handleChangeStatus}
                />

                {/* Mobile Stacked Cards */}
                <div className="md:hidden p-4 space-y-3">
                  {filteredTickets.map((ticket) => (
                    <TicketMobileCard
                      key={ticket.id}
                      ticket={ticket}
                      onAssignAgent={handleAssignAgent}
                      onChangeStatus={handleChangeStatus}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 4. Quick Workload View (Priority Breakdown & Status Breakdown) */}
        <AgentWorkloadBreakdown tickets={tickets} />

        {/* 5. Recent Agent Activity */}
        <RecentActivity activities={recentActivities} />
      </div>

      {/* Floating Confirmation / Error Toast */}
      {toastMessage && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 max-w-md ${
            toastMessage.startsWith('Error:')
              ? 'bg-[#B91C1C] text-white border border-[#DC2626]'
              : 'bg-[#063F3F] text-white border border-[#0B5252]'
          } px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200`}
        >
          {toastMessage.startsWith('Error:') ? (
            <div className="shrink-0 text-white font-bold">⚠</div>
          ) : (
            <CheckCircleIcon size={18} className="text-[#22C55E] shrink-0" />
          )}
          <div className="text-xs space-y-0.5 min-w-0 flex-1">
            <p className="font-semibold text-white">
              {toastMessage.startsWith('Error:') ? 'Action Failed' : 'Update Confirmation'}
            </p>
            <p className="text-slate-200 text-[11px] leading-snug">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-300 hover:text-white p-1 -mr-1 transition-colors"
            aria-label="Dismiss notification"
          >
            <XIcon size={14} />
          </button>
        </div>
      )}
    </AppShell>
  );
}
