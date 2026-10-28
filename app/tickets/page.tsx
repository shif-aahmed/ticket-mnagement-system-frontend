'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon, CheckCircleIcon, XIcon } from '@/components/ui/icons';
import { Card } from '@/components/ui/card';
import { TicketSummary } from '@/components/tickets/ticket-summary';
import { TicketFilters } from '@/components/tickets/ticket-filters';
import { TicketTable } from '@/components/tickets/ticket-table';
import { TicketMobileCard } from '@/components/tickets/ticket-mobile-card';
import { TicketPagination } from '@/components/tickets/ticket-pagination';
import { TicketEmptyState } from '@/components/tickets/ticket-empty-state';
import { Ticket, TicketFiltersState, TicketStatus, TicketSummaryMetric } from '@/types/ticket';
import { api } from '@/lib/api-client';

const PAGE_SIZE = 5;

const initialFilters: TicketFiltersState = {
  search: '',
  status: 'all',
  priority: 'all',
  assignee: 'all',
  type: 'all',
  department: 'all',
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filters, setFilters] = useState<TicketFiltersState>(initialFilters);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Auto-dismiss confirmation toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load real tickets from backend
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);
    api.tickets
      .list({
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
        department: filters.department,
        type: filters.type,
        limit: 50,
      })
      .then((res) => {
        if (!isMounted || !res) return;
        const items = Array.isArray(res.items) ? res.items : [];
        const mapped: Ticket[] = items.map((t: any) => ({
          id: t.code,
          subject: t.subject,
          description: t.description || '',
          status: t.status,
          priority: t.priority,
          type: t.type,
          department: t.department || 'General',
          category: t.category?.name || 'General',
          dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : undefined,
          requester: {
            name: t.requester?.name || 'Unknown',
            email: t.requester?.email || '',
            avatarUrl: t.requester?.avatarUrl,
          },
          assignee: {
            name: t.assignee?.name || 'Unassigned',
            email: t.assignee?.email || '',
            avatarUrl: t.assignee?.avatarUrl,
          },
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          commentsCount: t._count?.comments || 0,
          attachmentsCount: t._count?.attachments || 0,
        }));
        setTickets(mapped);
      })
      .catch((err: any) => {
        if (isMounted) setLoadError(err.message || 'Failed to load tickets.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Real agent assignment handler
  const handleAssignAgent = async (
    ticketId: string,
    assignee: { id: string; name: string; email: string }
  ) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              assignee: {
                name: assignee.name,
                email: assignee.email,
              },
              updatedAt: 'Just now',
            }
          : t
      )
    );
    const agentLabel = assignee.id === 'unassigned' ? 'Unassigned' : assignee.name;
    setToastMessage(`Assigned ${ticketId} to ${agentLabel}`);

    try {
      await api.tickets.assign(ticketId, assignee.id === 'unassigned' ? null : assignee.id);
    } catch (err: any) {
      setToastMessage(`Error: Failed to assign ticket — ${err.message || 'Unknown error'}`);
    }
  };

  // Real status change handler
  const handleChangeStatus = async (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: newStatus,
              updatedAt: 'Just now',
            }
          : t
      )
    );
    const statusLabel = newStatus.replace('_', ' ');
    setToastMessage(`Updated ${ticketId} status to "${statusLabel}"`);

    try {
      await api.tickets.updateStatus(ticketId, newStatus);
    } catch (err: any) {
      setToastMessage(`Error: Failed to update status — ${err.message || 'Unknown error'}`);
    }
  };

  // Derive unique assignees for dropdown
  const assignees = useMemo(() => {
    const names = new Set<string>();
    tickets.forEach((t) => names.add(t.assignee.name));
    return Array.from(names);
  }, [tickets]);

  // Read URL query parameters on initial mount (e.g. from Teams or Categories navigation)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const deptParam = params.get('department');
      const catParam = params.get('category');
      const searchParam = params.get('search');
      const typeParam = params.get('type');

      if (deptParam || catParam || searchParam || typeParam) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilters((prev) => ({
          ...prev,
          ...(deptParam ? { department: deptParam } : {}),
          ...(catParam ? { search: catParam } : {}),
          ...(searchParam ? { search: searchParam } : {}),
          ...(typeParam ? { type: typeParam as TicketFiltersState['type'] } : {}),
        }));
      }
    }
  }, []);

  // Filter tickets client-side
  const filteredTickets = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      // Search match (id, subject, requester, category)
      if (q) {
        const matchesId = ticket.id.toLowerCase().includes(q);
        const matchesSubject = ticket.subject.toLowerCase().includes(q);
        const matchesRequester = ticket.requester.name.toLowerCase().includes(q);
        const matchesCategory = ticket.category ? ticket.category.toLowerCase().includes(q) : false;
        if (!matchesId && !matchesSubject && !matchesRequester && !matchesCategory) {
          return false;
        }
      }

      // Status match
      if (filters.status !== 'all' && ticket.status !== filters.status) {
        return false;
      }

      // Priority match
      if (filters.priority !== 'all' && ticket.priority !== filters.priority) {
        return false;
      }

      // Assignee match
      if (filters.assignee !== 'all' && ticket.assignee.name !== filters.assignee) {
        return false;
      }

      // Type match
      if (filters.type && filters.type !== 'all' && ticket.type !== filters.type) {
        return false;
      }

      // Department match
      if (filters.department && filters.department !== 'all' && ticket.department !== filters.department) {
        return false;
      }

      return true;
    });
  }, [tickets, filters]);

  // Handle filter changes and reset to page 1
  const handleFilterChange = (newFilters: TicketFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Clear filters and reset
  const handleClearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  // Pagination slice
  const totalPages = Math.ceil(filteredTickets.length / PAGE_SIZE);
  const pagedTickets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTickets.slice(start, start + PAGE_SIZE);
  }, [filteredTickets, currentPage]);

  const isFiltered =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.assignee !== 'all' ||
    (filters.type !== undefined && filters.type !== 'all') ||
    (filters.department !== undefined && filters.department !== 'all');

  return (
    <AppShell
      title="Tickets"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Tickets' },
      ]}
    >
      {/* 1. Page Header */}
      <PageHeader
        title="Tickets"
        description="Manage, track, and monitor support requests."
        actions={
          <Link href="/tickets/create">
            <Button variant="primary" size="md" leftIcon={<PlusIcon size={16} />}>
              Create Ticket
            </Button>
          </Link>
        }
      />

      <div className="space-y-6">
        {/* 2. Compact Ticket Summary - computed from real data */}
        <TicketSummary metrics={(() => {
          const all = tickets.length;
          const open = tickets.filter(t => t.status === 'open').length;
          const inProg = tickets.filter(t => t.status === 'in_progress').length;
          const pending = tickets.filter(t => t.status === 'pending').length;
          const resolved = tickets.filter(t => t.status === 'resolved').length;
          return [
            { id: 'all', label: 'All Tickets', count: String(all) },
            { id: 'open', label: 'Open', count: String(open), status: 'open' as const },
            { id: 'in_progress', label: 'In Progress', count: String(inProg), status: 'in_progress' as const },
            { id: 'pending', label: 'Pending', count: String(pending), status: 'pending' as const },
            { id: 'resolved', label: 'Resolved', count: String(resolved), status: 'resolved' as const },
          ];
        })()}
        />

        {/* 3. Search and Filter Bar */}
        <TicketFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          assignees={assignees}
          onClearFilters={handleClearFilters}
        />

        {/* 4. Ticket Results */}
        {isLoading ? (
          <Card className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#6B7F7F] font-medium">Loading tickets...</p>
            </div>
          </Card>
        ) : loadError ? (
          <Card className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="h-10 w-10 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center border border-[#FECACA]">⚠</div>
              <p className="text-sm font-semibold text-[#102A2A]">Failed to load tickets</p>
              <p className="text-xs text-[#6B7F7F]">{loadError}</p>
            </div>
          </Card>
        ) : filteredTickets.length === 0 ? (
          <TicketEmptyState
            onClearFilters={handleClearFilters}
            isFiltered={isFiltered}
          />
        ) : (
          <div className="space-y-4">
            {/* Desktop Table Card Wrapper */}
            <Card className="hidden md:block overflow-hidden">
              <TicketTable
                tickets={pagedTickets}
                onAssignAgent={handleAssignAgent}
                onChangeStatus={handleChangeStatus}
              />
              <TicketPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={filteredTickets.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </Card>

            {/* Mobile Stacked Cards */}
            <div className="md:hidden space-y-3">
              {pagedTickets.map((ticket) => (
                <TicketMobileCard
                  key={ticket.id}
                  ticket={ticket}
                  onAssignAgent={handleAssignAgent}
                  onChangeStatus={handleChangeStatus}
                />
              ))}
              <div className="bg-white border border-[#E5EDE9] rounded-xl overflow-hidden">
                <TicketPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={filteredTickets.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Local Confirmation Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#063F3F] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#0B5252] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircleIcon size={18} className="text-[#22C55E] shrink-0" />
          <div className="text-xs space-y-0.5 min-w-0 flex-1">
            <p className="font-semibold text-white">Local Confirmation</p>
            <p className="text-slate-200 text-[11px] leading-snug">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-300 hover:text-white p-1 -mr-1 transition-colors"
            aria-label="Dismiss toast"
          >
            <XIcon size={14} />
          </button>
        </div>
      )}
    </AppShell>
  );
}
