'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AttachmentUploader } from '@/components/tickets/attachment-uploader';
import { CheckCircleIcon, PlusIcon } from '@/components/ui/icons';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import {
  CreateTicketFormData,
  CreateTicketFormErrors,
  TicketPriority,
  TicketType,
  AttachmentFile,
} from '@/types/ticket';
import {
  TICKET_TYPES,
  TICKET_DEPARTMENTS,
} from '@/lib/mock-tickets-data';

const PRIORITIES: { value: 'low' | 'medium' | 'high' | 'critical'; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const initialFormData: CreateTicketFormData = {
  subject: '',
  description: '',
  type: 'task',
  department: 'Engineering',
  project: '',
  dueDate: '',
  requester: '',
  category: '',
  priority: 'medium',
  assignee: 'unassigned',
  attachments: [],
};

export default function CreateTicketPage() {
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState<CreateTicketFormData>(initialFormData);
  const [errors, setErrors] = useState<CreateTicketFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<CreateTicketFormData | null>(null);
  const [apiCategories, setApiCategories] = useState<{ id: string; name: string }[]>([]);
  const [apiUsers, setApiUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadMeta() {
      setMetaLoading(true);
      setMetaError(null);
      try {
        const [catData, userData] = await Promise.allSettled([
          api.categories.list(),
          api.users.list({ limit: 100 }),
        ]);

        if (mounted) {
          const errors: string[] = [];
          if (catData.status === 'fulfilled' && Array.isArray(catData.value)) {
            setApiCategories(catData.value);
          } else {
            errors.push('categories');
          }
          if (userData.status === 'fulfilled' && userData.value) {
            const list = Array.isArray(userData.value) ? userData.value : (userData.value?.items || userData.value?.users);
            if (Array.isArray(list)) {
              setApiUsers(list.map((u: any) => ({ id: u.id, name: u.name, email: u.email })));
              if (currentUser && !formData.requester) {
                setFormData((prev) => ({ ...prev, requester: currentUser.id }));
              }
            } else {
              errors.push('users');
            }
          } else {
            errors.push('users');
          }
          if (errors.length > 0) {
            setMetaError(`Failed to load ${errors.join(' and ')}. Some options may be unavailable.`);
          }
        }
      } catch (e: any) {
        if (mounted) {
          setMetaError(e.message || 'Failed to load form data. Please refresh the page.');
        }
      } finally {
        if (mounted) setMetaLoading(false);
      }
    }
    loadMeta();
    return () => {
      mounted = false;
    };
  }, [currentUser]);

  // Validate fields
  const validateForm = (): boolean => {
    const newErrors: CreateTicketFormErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }

    if (!formData.type) {
      newErrors.type = 'Please select a ticket type.';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a department.';
    }

    if (!formData.requester) {
      newErrors.requester = 'Please select a requester.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.priority) {
      newErrors.priority = 'Please select a priority level.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Field change handler with instant error clearing
  const handleFieldChange = (field: keyof CreateTicketFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Attachments handlers
  const handleAddAttachments = (newFiles: AttachmentFile[]) => {
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }));
  };

  const handleRemoveAttachment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((f) => f.id !== id),
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      let isoDueDate: string | undefined = undefined;
      if (formData.dueDate) {
        const parsed = new Date(formData.dueDate);
        if (!isNaN(parsed.getTime())) {
          isoDueDate = parsed.toISOString();
        }
      }

      const matchedCategory = apiCategories.find(
        (c) => c.name === formData.category || c.id === formData.category
      );
      const categoryId = matchedCategory?.id;
      const assigneeId =
        formData.assignee && formData.assignee !== 'unassigned' ? formData.assignee : undefined;

      const payload: Record<string, unknown> = {
        subject: formData.subject,
        description: formData.description,
        type: formData.type,
        priority: formData.priority,
        department: formData.department,
        project: formData.project || undefined,
        dueDate: isoDueDate,
        categoryId: categoryId,
        assigneeId: assigneeId,
      };

      await api.tickets.create(payload);
      window.dispatchEvent(new Event('ticketgo:refresh-counts'));

      setSubmittedSnapshot(formData);
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
    setSubmittedSnapshot(null);
    setSubmitError(null);
  };

  const availableCategories = apiCategories.map((c) => c.name);

  const availableUsers = apiUsers;

  return (
    <AppShell
      title="Create Ticket"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Tickets', href: '/tickets' },
        { label: 'Create Ticket' },
      ]}
    >
      {/* Page Header */}
      <PageHeader
        title="Create Ticket"
        description="Create a new support ticket and assign it to the appropriate team member."
        breadcrumbs={[
          { label: 'Tickets', href: '/tickets' },
          { label: 'Create Ticket' },
        ]}
      />

      {/* Success Confirmation State */}
      {isSubmitted && submittedSnapshot ? (
        <Card className="max-w-2xl mx-auto border-[#BBF7D0] bg-white shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-full bg-[#DDF4E9] text-[#15803D] flex items-center justify-center shrink-0 border border-[#BBF7D0]">
                <CheckCircleIcon size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#102A2A]">
                  Ticket form validated successfully.
                </h3>
                <p className="text-xs md:text-sm text-[#6B7F7F]">
                  The ticket payload has passed all client-side validation rules and is ready for future API transmission.
                </p>
              </div>
            </div>

            {/* Validated Details Preview */}
            <div className="p-4 rounded-lg bg-[#F3F9F7] border border-[#E5EDE9] space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE9]">
                <span className="text-[#6B7F7F]">Subject</span>
                <span className="font-semibold text-[#102A2A] max-w-[320px] truncate text-right">
                  {submittedSnapshot.subject}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE9]">
                <span className="text-[#6B7F7F]">Type</span>
                <Badge variant="active" size="sm">
                  {TICKET_TYPES.find((t) => t.value === submittedSnapshot.type)?.label || submittedSnapshot.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE9]">
                <span className="text-[#6B7F7F]">Department</span>
                <span className="font-medium text-[#102A2A]">{submittedSnapshot.department}</span>
              </div>
              {submittedSnapshot.project && (
                <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE9]">
                  <span className="text-[#6B7F7F]">Project</span>
                  <span className="font-medium text-[#102A2A]">{submittedSnapshot.project}</span>
                </div>
              )}
              {submittedSnapshot.dueDate && (
                <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE9]">
                  <span className="text-[#6B7F7F]">Due Date</span>
                  <span className="font-medium text-[#063F3F] bg-[#DDF4E9] px-2 py-0.5 rounded border border-[#BBF7D0]">
                    {submittedSnapshot.dueDate}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE9]">
                <span className="text-[#6B7F7F]">Requester</span>
                <span className="font-medium text-[#102A2A]">
                  {apiUsers.find((r) => r.id === submittedSnapshot.requester)?.name || submittedSnapshot.requester}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE9]">
                <span className="text-[#6B7F7F]">Category</span>
                <Badge variant="neutral">{submittedSnapshot.category}</Badge>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE9]">
                <span className="text-[#6B7F7F]">Priority</span>
                <Badge
                  variant={
                    submittedSnapshot.priority === 'critical'
                      ? 'urgent'
                      : submittedSnapshot.priority === 'high'
                      ? 'warning'
                      : submittedSnapshot.priority === 'medium'
                      ? 'active'
                      : 'neutral'
                  }
                  dot
                >
                  <span className="capitalize">{submittedSnapshot.priority}</span>
                </Badge>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE9]">
                <span className="text-[#6B7F7F]">Assignee</span>
                <span className="font-medium text-[#102A2A]">
                  {submittedSnapshot.assignee && submittedSnapshot.assignee !== 'unassigned'
                    ? (apiUsers.find((a) => a.id === submittedSnapshot.assignee)?.name || submittedSnapshot.assignee)
                    : 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7F7F]">Attachments</span>
                <span className="font-medium text-[#102A2A]">
                  {submittedSnapshot.attachments.length > 0
                    ? `${submittedSnapshot.attachments.length} file(s) attached`
                    : 'None'}
                </span>
              </div>
            </div>

            {/* Confirmation Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="md" onClick={handleReset}>
                Create Another Ticket
              </Button>
              <Link href="/tickets">
                <Button variant="primary" size="md">
                  Return to Tickets
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        /* Main Create Ticket Form */
        <form onSubmit={handleSubmit} noValidate>
          {/* Submit Error Alert */}
          {submitError && (
            <div className="mb-4 p-3 rounded-lg bg-[#FEE2E2] border border-[#EF4444]/30 flex items-center gap-2 text-xs font-medium text-[#DC2626] animate-in fade-in">
              <span className="shrink-0">⚠</span>
              <span>{submitError}</span>
              <button type="button" onClick={() => setSubmitError(null)} className="ml-auto text-[#DC2626] hover:text-[#B91C1C]" aria-label="Dismiss error">✕</button>
            </div>
          )}
          {/* Meta Loading Warning */}
          {metaError && (
            <div className="mb-4 p-3 rounded-lg bg-[#FEF3C7] border border-[#F59E0B]/30 flex items-center gap-2 text-xs font-medium text-[#92400E] animate-in fade-in">
              <span className="shrink-0">⚠</span>
              <span>{metaError}</span>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols): Ticket Details & Attachments */}
            <div className="lg:col-span-8 space-y-6">
              {/* Section 1 — Ticket Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Details</CardTitle>
                  <CardDescription>
                    Define the task, support request, bug, or organizational work item to track.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subject Input */}
                  <div>
                    <Input
                      label="Subject / Work Title *"
                      placeholder="e.g., Build OAuth Token Revocation Endpoint or VPN connection failure"
                      value={formData.subject}
                      onChange={(e) => handleFieldChange('subject', e.target.value)}
                      errorMessage={errors.subject}
                      aria-required="true"
                    />
                  </div>

                  {/* Work Type & Department Selects */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Ticket Type *"
                      id="ticket-type-select"
                      value={formData.type}
                      onChange={(e) => handleFieldChange('type', e.target.value as TicketType)}
                      errorMessage={errors.type}
                      aria-required="true"
                    >
                      {TICKET_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </Select>

                    <Select
                      label="Department *"
                      id="ticket-department-select"
                      value={formData.department}
                      onChange={(e) => handleFieldChange('department', e.target.value)}
                      errorMessage={errors.department}
                      aria-required="true"
                    >
                      {TICKET_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Project & Due Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Project (Optional)"
                      placeholder="e.g., Core Platform v2, Q4 Campaign"
                      value={formData.project || ''}
                      onChange={(e) => handleFieldChange('project', e.target.value)}
                    />

                    <Input
                      label="Due Date (Optional)"
                      placeholder="e.g., Tomorrow, Oct 28, 2026"
                      value={formData.dueDate || ''}
                      onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                    />
                  </div>

                  {/* Description Textarea */}
                  <div>
                    <Textarea
                      label="Description *"
                      placeholder="Describe the task, work specifications, or issue details in full context..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      errorMessage={errors.description}
                      aria-required="true"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Attachments Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                  <CardDescription>
                    Attach design files, specifications, logs, telemetry screenshots, or evidence.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttachmentUploader
                    attachments={formData.attachments}
                    onAddAttachments={handleAddAttachments}
                    onRemoveAttachment={handleRemoveAttachment}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column (4 cols): Requester & Assignment + Action Controls */}
            <div className="lg:col-span-4 space-y-6">
              {/* Section 2 — Requester & Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle>Requester & Assignment</CardTitle>
                  <CardDescription>
                    Route this ticket to the right person, team member, or queue.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Requester Select */}
                  <Select
                    label="Requester *"
                    id="ticket-requester-select"
                    value={formData.requester}
                    onChange={(e) => handleFieldChange('requester', e.target.value)}
                    errorMessage={errors.requester}
                    aria-required="true"
                  >
                    <option value="">Select requester...</option>
                    {availableUsers.map((req) => (
                      <option key={req.id} value={req.id}>
                        {req.name} ({req.email})
                      </option>
                    ))}
                  </Select>

                  {/* Category Select */}
                  <Select
                    label="Category *"
                    id="ticket-category-select"
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    errorMessage={errors.category}
                    aria-required="true"
                  >
                    <option value="">Select category...</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>

                  {/* Priority Select */}
                  <Select
                    label="Priority *"
                    id="ticket-priority-select"
                    value={formData.priority}
                    onChange={(e) =>
                      handleFieldChange('priority', e.target.value as TicketPriority)
                    }
                    errorMessage={errors.priority}
                    aria-required="true"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </Select>

                  {/* Assignee Select (Optional, unassigned supported) */}
                  <Select
                    label="Assignee (Optional)"
                    id="ticket-assignee-select"
                    value={formData.assignee}
                    onChange={(e) => handleFieldChange('assignee', e.target.value)}
                    helperText="Leave unassigned if automatic dispatch or queue triage is preferred."
                  >
                    <option value="unassigned">Unassigned</option>
                    {availableUsers.map((asg) => (
                      <option key={asg.id} value={asg.id}>
                        {asg.name} {asg.email ? `(${asg.email})` : ''}
                      </option>
                    ))}
                  </Select>
                </CardContent>
              </Card>

              {/* Form Submission Actions */}
              <Card>
                <CardContent className="p-4 md:p-5 space-y-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                    leftIcon={<PlusIcon size={16} />}
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create Ticket'}
                  </Button>

                  <Link href="/tickets" className="block">
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full justify-center"
                    >
                      Cancel
                    </Button>
                  </Link>

                  <p className="text-[11px] text-[#6B7F7F] text-center pt-1">
                    Tickets created will be visible to assignees and customer stakeholders.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      )}
    </AppShell>
  );
}
