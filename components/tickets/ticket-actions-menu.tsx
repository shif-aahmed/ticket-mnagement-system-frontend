'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import {
  EyeIcon,
  MoreVerticalIcon,
  XIcon,
  CheckIcon,
  CheckCircleIcon,
  UserIcon,
} from '@/components/ui/icons';
import { TicketStatus } from '@/types/ticket';
import { api } from '@/lib/api-client';

export interface TicketActionsMenuProps {
  ticketId: string;
  currentAssigneeName?: string;
  currentStatus?: TicketStatus;
  onAssignAgent?: (
    ticketId: string,
    assignee: { id: string; name: string; email: string }
  ) => void;
  onChangeStatus?: (ticketId: string, status: TicketStatus) => void;
}

const statusBadgeMap: Record<TicketStatus, BadgeVariant> = {
  submitted: 'neutral',
  open: 'active',
  in_progress: 'warning',
  pending: 'warning',
  resolved: 'success',
  closed: 'neutral',
};

const TICKET_STATUS_OPTIONS: {
  value: TicketStatus;
  label: string;
  description: string;
}[] = [
  { value: 'submitted', label: 'Submitted', description: 'Newly logged request' },
  { value: 'open', label: 'Open', description: 'Awaiting agent action' },
  { value: 'in_progress', label: 'In Progress', description: 'Currently actively investigated' },
  { value: 'pending', label: 'Pending', description: 'Awaiting requester response' },
  { value: 'resolved', label: 'Resolved', description: 'Fix verified and completed' },
  { value: 'closed', label: 'Closed', description: 'Ticket finalized and archived' },
];

export const TicketActionsMenu = ({
  ticketId,
  currentAssigneeName,
  currentStatus,
  onAssignAgent,
  onChangeStatus,
}: TicketActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Agents list from backend
  const [agents, setAgents] = useState<{ id: string; name: string; email: string }[]>([
    { id: 'unassigned', name: 'Unassigned', email: '' },
  ]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected agent in modal
  const [selectedAgentId, setSelectedAgentId] = useState<string>('unassigned');

  // Selected status in modal
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(
    currentStatus || 'open'
  );

  // Feedback notice
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const cleanId = ticketId.replace('#', '');

  // Load agents from backend when assign modal opens
  useEffect(() => {
    if (isAssignModalOpen) {
      setAssignError(null);
      setIsLoadingAgents(true);
      api.users
        .list({ limit: 100 })
        .then((res: any) => {
          const raw = Array.isArray(res) ? res : res?.items || res?.users || [];
          const mapped = [
            { id: 'unassigned', name: 'Unassigned', email: '' },
            ...raw.map((u: any) => ({ id: u.id, name: u.name, email: u.email })),
          ];
          setAgents(mapped);
          if (currentAssigneeName) {
            const found = mapped.find((a) => a.name === currentAssigneeName);
            if (found) setSelectedAgentId(found.id);
          }
        })
        .catch((err: any) => {
          setAssignError(err.message || 'Failed to load user list.');
        })
        .finally(() => {
          setIsLoadingAgents(false);
        });
    }
  }, [isAssignModalOpen, currentAssigneeName]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAssignModalOpen) setIsAssignModalOpen(false);
        else if (isStatusModalOpen) setIsStatusModalOpen(false);
        else if (isOpen) setIsOpen(false);
      }
    };
    if (isOpen || isAssignModalOpen || isStatusModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isAssignModalOpen, isStatusModalOpen]);

  const handleConfirmAssign = async () => {
    const agent =
      agents.find((a) => a.id === selectedAgentId) || { id: selectedAgentId, name: 'Unassigned', email: '' };
    setIsSubmitting(true);
    setAssignError(null);
    try {
      await api.tickets.assign(
        cleanId,
        selectedAgentId === 'unassigned' ? null : selectedAgentId
      );
      onAssignAgent?.(ticketId, agent);
      setLocalFeedback(`Ticket ${ticketId} assigned to ${agent.name}`);
      setTimeout(() => {
        setIsAssignModalOpen(false);
        setLocalFeedback(null);
      }, 1000);
    } catch (err: any) {
      setAssignError(err.message || 'Failed to assign ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmStatus = async () => {
    setIsSubmitting(true);
    setStatusError(null);
    try {
      await api.tickets.updateStatus(cleanId, selectedStatus);
      window.dispatchEvent(new Event('ticketgo:refresh-counts'));
      onChangeStatus?.(ticketId, selectedStatus);
      const label =
        TICKET_STATUS_OPTIONS.find((s) => s.value === selectedStatus)?.label || selectedStatus;
      setLocalFeedback(`Ticket ${ticketId} status changed to ${label}`);
      setTimeout(() => {
        setIsStatusModalOpen(false);
        setLocalFeedback(null);
      }, 1000);
    } catch (err: any) {
      setStatusError(err.message || 'Failed to update ticket status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={menuRef} className="relative inline-flex items-center gap-1.5">
      {/* 1. View Primary Link */}
      <Link
        href={`/tickets/${cleanId}`}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#063F3F] bg-white border border-[#E5EDE9] rounded-md hover:bg-[#F3F9F7] hover:border-[#CBD5E1] transition-colors"
        title={`View ticket ${ticketId}`}
      >
        <EyeIcon size={14} className="text-[#6B7F7F]" />
        <span>View</span>
      </Link>

      {/* 2. More Actions Toggle */}
      <IconButton
        variant="ghost"
        size="sm"
        aria-label={`More actions for ticket ${ticketId}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-[#6B7F7F] hover:text-[#102A2A] h-7 w-7"
      >
        <MoreVerticalIcon size={15} />
      </IconButton>

      {/* 3. Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-8 z-30 w-44 bg-white border border-[#E5EDE9] rounded-lg shadow-lg py-1 text-xs text-[#102A2A] animate-in fade-in zoom-in-95 duration-100">
          <Link
            href={`/tickets/${cleanId}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center w-full px-3 py-1.5 hover:bg-[#F3F9F7] text-left transition-colors"
          >
            View details
          </Link>
          <Link
            href={`/tickets/${cleanId}/edit`}
            onClick={() => setIsOpen(false)}
            className="flex items-center w-full px-3 py-1.5 hover:bg-[#F3F9F7] text-left transition-colors"
          >
            Edit ticket
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setLocalFeedback(null);
              setAssignError(null);
              setIsAssignModalOpen(true);
            }}
            className="flex items-center w-full px-3 py-1.5 hover:bg-[#F3F9F7] text-left transition-colors cursor-pointer"
          >
            Assign agent
          </button>
          <div className="my-1 border-t border-[#F1F5F4]" />
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setLocalFeedback(null);
              setStatusError(null);
              if (currentStatus) {
                setSelectedStatus(currentStatus);
              }
              setIsStatusModalOpen(true);
            }}
            className="flex items-center w-full px-3 py-1.5 hover:bg-[#F3F9F7] text-left text-[#063F3F] font-medium transition-colors cursor-pointer"
          >
            Change status...
          </button>
        </div>
      )}

      {/* 4. "Assign Agent" Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`assign-agent-title-${cleanId}`}
            className="bg-white rounded-xl border border-[#E5EDE9] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5EDE9] bg-[#FAFDFC]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3
                    id={`assign-agent-title-${cleanId}`}
                    className="text-sm font-bold text-[#102A2A]"
                  >
                    Assign Agent
                  </h3>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#E6F4F1] text-[#063F3F]">
                    {ticketId}
                  </span>
                </div>
                <p className="text-xs text-[#6B7F7F]">
                  Select an agent to handle this ticket.
                </p>
              </div>
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Close dialog"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-[#6B7F7F] hover:text-[#102A2A] -mr-1.5"
              >
                <XIcon size={16} />
              </IconButton>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3 max-h-[340px] overflow-y-auto">
              {isLoadingAgents ? (
                <div className="py-8 flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : assignError ? (
                <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-xs text-[#B91C1C]">
                  {assignError}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {agents.map((agent) => {
                    const isSelected = selectedAgentId === agent.id;
                    const isUnassigned = agent.id === 'unassigned';

                    return (
                      <div
                        key={agent.id}
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'border-[#063F3F] bg-[#E6F4F1]/40 ring-1 ring-[#063F3F]'
                            : 'border-[#E5EDE9] hover:border-[#CBD5E1] hover:bg-[#FAFDFC]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isUnassigned ? (
                            <div className="h-7 w-7 rounded-full bg-slate-100 border border-[#E5EDE9] flex items-center justify-center text-slate-500 shrink-0">
                              <UserIcon size={14} />
                            </div>
                          ) : (
                            <Avatar name={agent.name} size="xs" className="bg-[#064747]" />
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-[#102A2A] truncate">
                              {agent.name}
                            </span>
                            {agent.email ? (
                              <span className="text-[11px] text-[#6B7F7F] truncate">
                                {agent.email}
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#6B7F7F] italic">
                                Queue triage / unassigned
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-[#063F3F] text-white flex items-center justify-center shrink-0">
                            <CheckIcon size={12} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Confirmation feedback */}
              {localFeedback && (
                <div className="p-3 bg-[#E6F4F1] border border-[#22C55E]/40 rounded-lg flex items-center gap-2 text-xs font-medium text-[#063F3F] animate-in fade-in">
                  <CheckCircleIcon size={16} className="text-[#22C55E] shrink-0" />
                  <span>{localFeedback}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#E5EDE9] bg-[#FAFDFC]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAssignModalOpen(false)}
                disabled={Boolean(localFeedback) || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmAssign}
                isLoading={isSubmitting}
                disabled={Boolean(localFeedback) || isLoadingAgents}
              >
                Confirm Assignment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. "Change Status" Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`change-status-title-${cleanId}`}
            className="bg-white rounded-xl border border-[#E5EDE9] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5EDE9] bg-[#FAFDFC]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3
                    id={`change-status-title-${cleanId}`}
                    className="text-sm font-bold text-[#102A2A]"
                  >
                    Change Status
                  </h3>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#E6F4F1] text-[#063F3F]">
                    {ticketId}
                  </span>
                </div>
                <p className="text-xs text-[#6B7F7F]">
                  Select a lifecycle status for this ticket.
                </p>
              </div>
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Close dialog"
                onClick={() => setIsStatusModalOpen(false)}
                className="text-[#6B7F7F] hover:text-[#102A2A] -mr-1.5"
              >
                <XIcon size={16} />
              </IconButton>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3 max-h-[340px] overflow-y-auto">
              {statusError && (
                <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-xs text-[#B91C1C]">
                  {statusError}
                </div>
              )}

              <div className="space-y-1.5">
                {TICKET_STATUS_OPTIONS.map((statusItem) => {
                  const isSelected = selectedStatus === statusItem.value;

                  return (
                    <div
                      key={statusItem.value}
                      onClick={() => setSelectedStatus(statusItem.value)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'border-[#063F3F] bg-[#E6F4F1]/40 ring-1 ring-[#063F3F]'
                          : 'border-[#E5EDE9] hover:border-[#CBD5E1] hover:bg-[#FAFDFC]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Badge
                          variant={statusBadgeMap[statusItem.value]}
                          size="sm"
                        >
                          {statusItem.label}
                        </Badge>
                        <span className="text-xs text-[#6B7F7F]">
                          {statusItem.description}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="h-5 w-5 rounded-full bg-[#063F3F] text-white flex items-center justify-center shrink-0">
                          <CheckIcon size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Confirmation feedback */}
              {localFeedback && (
                <div className="p-3 bg-[#E6F4F1] border border-[#22C55E]/40 rounded-lg flex items-center gap-2 text-xs font-medium text-[#063F3F] animate-in fade-in">
                  <CheckCircleIcon size={16} className="text-[#22C55E] shrink-0" />
                  <span>{localFeedback}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#E5EDE9] bg-[#FAFDFC]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStatusModalOpen(false)}
                disabled={Boolean(localFeedback) || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmStatus}
                isLoading={isSubmitting}
                disabled={Boolean(localFeedback)}
              >
                Apply Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
