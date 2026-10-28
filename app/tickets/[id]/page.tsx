'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  TicketsIcon,
  ClockIcon,
  ChevronLeftIcon,
  FileTextIcon,
} from '@/components/ui/icons';
import { TicketPriority, TicketStatus, Ticket } from '@/types/ticket';
import { api } from '@/lib/api-client';

const priorityBadgeMap: Record<TicketPriority, BadgeVariant> = {
  critical: 'urgent',
  high: 'warning',
  medium: 'active',
  low: 'neutral',
};

const statusBadgeMap: Record<TicketStatus, BadgeVariant> = {
  submitted: 'neutral',
  open: 'active',
  in_progress: 'warning',
  pending: 'warning',
  resolved: 'success',
  closed: 'neutral',
};

export default function TicketDetailsPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const decodedId = decodeURIComponent(id);

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setLoadError(null);

    api.tickets
      .get(decodedId)
      .then((backendTicket: any) => {
        if (!mounted) return;
        if (backendTicket && (backendTicket.code || backendTicket.id)) {
          setTicket({
            id: backendTicket.code || backendTicket.id,
            subject: backendTicket.subject,
            description: backendTicket.description || '',
            status: backendTicket.status,
            priority: backendTicket.priority,
            type: backendTicket.type,
            department: backendTicket.department || 'General',
            category: backendTicket.category?.name || 'General',
            project: backendTicket.project,
            dueDate: backendTicket.dueDate ? new Date(backendTicket.dueDate).toISOString().split('T')[0] : undefined,
            requester: {
              name: backendTicket.requester?.name || 'Unknown',
              email: backendTicket.requester?.email || '',
              avatarUrl: backendTicket.requester?.avatarUrl,
            },
            assignee: {
              name: backendTicket.assignee?.name || 'Unassigned',
              email: backendTicket.assignee?.email || '',
              avatarUrl: backendTicket.assignee?.avatarUrl,
            },
            createdAt: backendTicket.createdAt
              ? new Date(backendTicket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Recently',
            updatedAt: backendTicket.updatedAt
              ? new Date(backendTicket.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Recently',
            attachments: (backendTicket.attachments || []).map((att: any) => ({
              id: att.id,
              name: att.filename,
              size: att.size,
              formattedSize: att.size > 1048576 ? `${(att.size / 1048576).toFixed(1)} MB` : `${Math.round(att.size / 1024)} KB`,
            })),
            activityHistory: (backendTicket.activities || []).map((act: any) => ({
              id: act.id,
              type: act.type || 'status_updated',
              actor: {
                name: act.actor?.name || 'System',
                avatarUrl: act.actor?.avatarUrl,
                role: act.actor?.role,
              },
              description: act.description || 'Activity recorded',
              timestamp: new Date(act.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              comment: act.comment,
            })),
          });
        }
      })
      .catch((err: any) => {
        if (mounted) setLoadError(err.message || 'Failed to load ticket.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, [decodedId]);

  // Loading State
  if (isLoading) {
    return (
      <AppShell title="Loading Ticket" breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Tickets', href: '/tickets' }, { label: '...' }]}>
        <div className="py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#6B7F7F] font-medium">Loading ticket...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  // Error / Not Found State
  if (loadError || !ticket) {
    return (
      <AppShell
        title="Ticket Not Found"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Tickets', href: '/tickets' },
          { label: 'Not Found' },
        ]}
      >
        <PageHeader
          title="Ticket Not Found"
          description="The requested ticket could not be located in the system."
          breadcrumbs={[
            { label: 'Tickets', href: '/tickets' },
            { label: 'Not Found' },
          ]}
        />

        <Card className="max-w-xl mx-auto text-center py-12 px-6 space-y-4">
          <div className="h-12 w-12 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center mx-auto border border-[#FECACA]">
            <TicketsIcon size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#102A2A]">
              {loadError ? 'Failed to load ticket' : 'Ticket not found'}
            </h3>
            <p className="text-xs md:text-sm text-[#6B7F7F] max-w-md mx-auto">
              {loadError || `We could not find a ticket matching identifier \u201c${decodedId}\u201d. It may have been archived, deleted, or the URL might be mistyped.`}
            </p>
          </div>
          <div className="pt-2">
            <Link href="/tickets">
              <Button variant="primary" size="md" leftIcon={<ChevronLeftIcon size={16} />}>
                Back to Tickets
              </Button>
            </Link>
          </div>
        </Card>
      </AppShell>
    );
  }

  const editHref = `/tickets/${ticket.id.replace('#', '')}/edit`;

  return (
    <AppShell
      title={`Ticket ${ticket.id}`}
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Tickets', href: '/tickets' },
        { label: ticket.id },
      ]}
    >
      {/* Page Header */}
      <PageHeader
        title={ticket.subject}
        description={`Ticket ID: ${ticket.id} • Created ${ticket.createdAt || 'recently'}`}
        breadcrumbs={[
          { label: 'Tickets', href: '/tickets' },
          { label: ticket.id },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/tickets">
              <Button variant="secondary" size="md" leftIcon={<ChevronLeftIcon size={16} />}>
                Back to Tickets
              </Button>
            </Link>
            <Link href={editHref}>
              <Button variant="primary" size="md">
                Edit Ticket
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Ticket Header Summary Bar */}
        <Card className="p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-sm font-bold text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded border border-[#BBF7D0]">
                {ticket.id}
              </span>
              {/* Type Badge */}
              <Badge
                variant={
                  ticket.type === 'incident'
                    ? 'urgent'
                    : ticket.type === 'bug'
                    ? 'warning'
                    : ticket.type === 'support_request'
                    ? 'active'
                    : 'active'
                }
                size="md"
              >
                <span className="capitalize">
                  {ticket.type ? ticket.type.replace('_', ' ') : 'Task'}
                </span>
              </Badge>
              {/* Department */}
              {ticket.department && (
                <span className="text-xs font-semibold text-[#102A2A] bg-[#F1F5F9] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                  {ticket.department}
                </span>
              )}
              {/* Project */}
              {ticket.project && (
                <span className="text-xs text-[#063F3F] bg-[#F3F9F7] px-2.5 py-1 rounded-md border border-[#E5EDE9]">
                  Project: <strong>{ticket.project}</strong>
                </span>
              )}
              {/* Status */}
              <Badge variant={statusBadgeMap[ticket.status]} dot size="md">
                <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
              </Badge>
              {/* Priority */}
              <Badge variant={priorityBadgeMap[ticket.priority]} dot size="md">
                <span className="capitalize">{ticket.priority} Priority</span>
              </Badge>
              {/* Due Date */}
              {ticket.dueDate && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F766E] bg-[#CCFBF1] px-2.5 py-1 rounded-md border border-[#99F6E4]">
                  <ClockIcon size={13} />
                  <span>Due: {ticket.dueDate}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-[#6B7F7F]">
              <div className="flex items-center gap-1.5">
                <ClockIcon size={14} className="shrink-0" />
                <span>Last updated {ticket.updatedAt}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Main 2/3 Content and 1/3 Metadata Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Column (8 cols): Description, Attachments, and Activity */}
          <div className="lg:col-span-8 space-y-6">
            {/* Description Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Description</CardTitle>
                <CardDescription>
                  Detailed customer inquiry, task specification, or incident report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs md:text-sm text-[#102A2A] leading-relaxed">
                <p>
                  {ticket.description || 'No detailed description provided for this ticket.'}
                </p>
              </CardContent>
            </Card>

            {/* Attachments Card (Display Only) */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attachments ({ticket.attachments.length})</CardTitle>
                  <CardDescription>
                    Diagnostic files, specifications, and evidence attached to this ticket
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-[#E5EDE9] border border-[#E5EDE9] rounded-lg bg-white overflow-hidden">
                    {ticket.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 hover:bg-[#F3F9F7]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-md bg-[#F3F9F7] border border-[#E5EDE9] flex items-center justify-center text-[#063F3F] shrink-0">
                            <FileTextIcon size={18} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-[#102A2A] truncate">
                              {file.name}
                            </span>
                            <span className="text-[11px] text-[#6B7F7F]">
                              {file.formattedSize}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded border border-[#BBF7D0]">
                          Attached
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity / History Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle>Activity & History</CardTitle>
                <CardDescription>
                  Complete audit trail of triage events, assignments, and status updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ticket.activityHistory && ticket.activityHistory.length > 0 ? (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5EDE9]">
                    {ticket.activityHistory.map((act) => (
                      <div key={act.id} className="relative space-y-1">
                        <span className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-[#063F3F] border-2 border-white shadow-xs" />
                        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                          <span className="font-semibold text-[#102A2A]">
                            {act.actor.name}{' '}
                            {act.actor.role && (
                              <span className="font-normal text-[#6B7F7F]">
                                ({act.actor.role})
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] text-[#6B7F7F]">{act.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#6B7F7F]">{act.description}</p>
                        {act.comment && (
                          <div className="mt-2 p-3 rounded-lg bg-[#F3F9F7] border border-[#E5EDE9] text-xs text-[#102A2A] italic">
                            &ldquo;{act.comment}&rdquo;
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#6B7F7F]">No audit activity recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Metadata Column (4 cols): Clear Work Context */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Context & Metadata</CardTitle>
                <CardDescription>Organizational ownership and schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs">
                {/* 1. Type */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F4]">
                  <span className="text-[#6B7F7F]">Type</span>
                  <Badge variant="active" size="sm">
                    <span className="capitalize">
                      {ticket.type ? ticket.type.replace('_', ' ') : 'Task'}
                    </span>
                  </Badge>
                </div>

                {/* 2. Department */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F4]">
                  <span className="text-[#6B7F7F]">Department</span>
                  <span className="font-semibold text-[#102A2A]">
                    {ticket.department || 'Engineering'}
                  </span>
                </div>

                {/* 3. Project */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F4]">
                  <span className="text-[#6B7F7F]">Project</span>
                  <span className="font-medium text-[#102A2A]">
                    {ticket.project || '—'}
                  </span>
                </div>

                {/* 4. Requester */}
                <div className="space-y-1.5 pb-2.5 border-b border-[#F1F5F4]">
                  <span className="text-[#6B7F7F] block">Requester</span>
                  <div className="flex items-center gap-2">
                    <Avatar name={ticket.requester.name} size="xs" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-[#102A2A] truncate">
                        {ticket.requester.name}
                      </span>
                      <span className="text-[10px] text-[#6B7F7F] truncate">
                        {ticket.requester.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Assignee */}
                <div className="space-y-1.5 pb-2.5 border-b border-[#F1F5F4]">
                  <span className="text-[#6B7F7F] block">Assignee</span>
                  <div className="flex items-center gap-2">
                    <Avatar name={ticket.assignee.name} size="xs" className="bg-[#064747]" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-[#102A2A] truncate">
                        {ticket.assignee.name}
                      </span>
                      <span className="text-[10px] text-[#6B7F7F] truncate">
                        {ticket.assignee.email || 'Unassigned Queue'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Priority */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F4]">
                  <span className="text-[#6B7F7F]">Priority</span>
                  <Badge variant={priorityBadgeMap[ticket.priority]} dot size="sm">
                    <span className="capitalize">{ticket.priority}</span>
                  </Badge>
                </div>

                {/* 7. Status */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F4]">
                  <span className="text-[#6B7F7F]">Status</span>
                  <Badge variant={statusBadgeMap[ticket.status]} dot size="sm">
                    <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                  </Badge>
                </div>

                {/* 8. Due Date */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F4]">
                  <span className="text-[#6B7F7F]">Due Date</span>
                  <span className="font-semibold text-[#063F3F]">
                    {ticket.dueDate || 'No due date'}
                  </span>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F4]">
                  <span className="text-[#6B7F7F]">Category</span>
                  <span className="font-medium text-[#102A2A]">
                    {ticket.category || 'General'}
                  </span>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F4]">
                  <span className="text-[#6B7F7F]">Created</span>
                  <span className="font-medium text-[#102A2A]">
                    {ticket.createdAt || 'Recently'}
                  </span>
                </div>

                {/* Last Updated */}
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7F7F]">Last Updated</span>
                  <span className="font-medium text-[#102A2A]">
                    {ticket.updatedAt}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardContent className="p-4 md:p-5 space-y-3">
                <Link href={editHref} className="block">
                  <Button variant="primary" size="md" className="w-full justify-center">
                    Edit Ticket
                  </Button>
                </Link>
                <Link href="/tickets" className="block">
                  <Button variant="secondary" size="md" className="w-full justify-center">
                    Back to Tickets
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
