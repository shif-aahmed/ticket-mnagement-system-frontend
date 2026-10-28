'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from '@/components/ui/icons';
import { EditTicketForm } from '@/components/tickets/edit-ticket-form';
import { Ticket } from '@/types/ticket';
import { api } from '@/lib/api-client';

export default function EditTicketPage() {
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
            department: backendTicket.department || 'Engineering',
            category: backendTicket.category?.name || 'General',
            project: backendTicket.project || '',
            dueDate: backendTicket.dueDate
              ? new Date(backendTicket.dueDate).toISOString().split('T')[0]
              : undefined,
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
            categoryId: backendTicket.categoryId,
            requesterId: backendTicket.requesterId || backendTicket.requester?.id,
            assigneeId: backendTicket.assigneeId || backendTicket.assignee?.id,
            createdAt: backendTicket.createdAt,
            updatedAt: backendTicket.updatedAt,
          } as any);
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

  // Loading state
  if (isLoading) {
    return (
      <AppShell title="Loading..." breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Tickets', href: '/tickets' }, { label: '...' }]}>
        <div className="py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#6B7F7F] font-medium">Loading ticket...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  // Not found / error
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
        />
        <div className="max-w-xl mx-auto mt-8">
          <Card className="text-center p-8">
            <CardHeader className="p-0 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">!</span>
              </div>
              <CardTitle className="text-lg">
                {loadError ? 'Failed to load ticket' : 'Ticket not found'}
              </CardTitle>
              <CardDescription className="mt-1.5 text-sm text-[#6B7F7F] max-w-md mx-auto">
                {loadError || `We could not find a ticket matching identifier \u201c${decodedId}\u201d. It may have been archived, deleted, or the URL might be mistyped.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Link href="/tickets">
                <Button variant="primary" size="md">
                  Back to Tickets
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const cleanId = ticket.id.replace('#', '');

  return (
    <AppShell
      title={`Edit Ticket ${ticket.id}`}
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Tickets', href: '/tickets' },
        { label: ticket.id, href: `/tickets/${cleanId}` },
        { label: 'Edit' },
      ]}
    >
      <PageHeader
        title="Edit Ticket"
        description="Update ticket information, priority, assignment, and status."
        actions={
          <Link href={`/tickets/${cleanId}`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeftIcon size={16} />}
            >
              Cancel
            </Button>
          </Link>
        }
      />

      <div className="pb-8">
        <EditTicketForm ticket={ticket} />
      </div>
    </AppShell>
  );
}
