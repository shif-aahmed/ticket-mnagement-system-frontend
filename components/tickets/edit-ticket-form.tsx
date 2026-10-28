'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { CheckCircleIcon } from '@/components/ui/icons';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketType,
  EditTicketFormData,
  EditTicketFormErrors,
} from '@/types/ticket';
import {
  TICKET_TYPES,
  TICKET_DEPARTMENTS,
} from '@/lib/mock-tickets-data';
import { api } from '@/lib/api-client';

interface EditTicketFormProps {
  ticket: Ticket & { categoryId?: string; requesterId?: string; assigneeId?: string };
}

const PRIORITIES: { value: TicketPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const STATUSES: { value: TicketStatus; label: string }[] = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export const EditTicketForm = ({ ticket }: EditTicketFormProps) => {
  const cleanId = ticket.id.replace('#', '');

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);

  const [formData, setFormData] = useState<EditTicketFormData>({
    subject: ticket.subject,
    description: ticket.description || '',
    type: ticket.type || 'task',
    department: ticket.department || 'Engineering',
    project: ticket.project || '',
    dueDate: ticket.dueDate || '',
    category: ticket.categoryId || ticket.category || '',
    priority: ticket.priority,
    status: ticket.status,
    requester: ticket.requesterId || ticket.requester?.name || '',
    assignee: ticket.assigneeId || 'unassigned',
  });

  const [errors, setErrors] = useState<EditTicketFormErrors>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch real categories and users from backend API
  useEffect(() => {
    let isMounted = true;
    setIsLoadingMeta(true);
    Promise.allSettled([
      api.categories.list(),
      api.users.list({ limit: 100 }),
    ]).then(([catRes, userRes]) => {
      if (!isMounted) return;
      if (catRes.status === 'fulfilled' && Array.isArray(catRes.value)) {
        setCategories(catRes.value);
        // If ticket.category is name, match id
        if (ticket.category) {
          const match = catRes.value.find(
            (c: any) => c.name.toLowerCase() === ticket.category?.toLowerCase() || c.id === ticket.category
          );
          if (match) {
            setFormData((prev) => ({ ...prev, category: match.id }));
          }
        }
      }
      if (userRes.status === 'fulfilled') {
        const uVal = userRes.value;
        const list = Array.isArray(uVal) ? uVal : uVal?.items || uVal?.users || [];
        if (Array.isArray(list)) {
          const mappedUsers = list.map((u: any) => ({ id: u.id, name: u.name, email: u.email }));
          setUsers(mappedUsers);

          // Resolve requester id if stored as name/email
          const foundReq = mappedUsers.find(
            (u) => u.id === ticket.requesterId || u.email === ticket.requester?.email || u.name === ticket.requester?.name
          );
          if (foundReq) {
            setFormData((prev) => ({ ...prev, requester: foundReq.id }));
          }

          // Resolve assignee id if stored as name/email
          const foundAsg = mappedUsers.find(
            (u) => u.id === ticket.assigneeId || u.email === ticket.assignee?.email || u.name === ticket.assignee?.name
          );
          if (foundAsg) {
            setFormData((prev) => ({ ...prev, assignee: foundAsg.id }));
          }
        }
      }
    }).finally(() => {
      if (isMounted) setIsLoadingMeta(false);
    });

    return () => {
      isMounted = false;
    };
  }, [ticket]);

  // Field change handler with instant error clearing
  const handleFieldChange = (field: keyof EditTicketFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Form submission validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const newErrors: EditTicketFormErrors = {};

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

    if (!formData.status) {
      newErrors.status = 'Please select a status.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaved(false);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await api.tickets.update(cleanId, {
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        type: formData.type,
        department: formData.department,
        project: formData.project?.trim() || undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        priority: formData.priority,
        status: formData.status,
        categoryId: formData.category || undefined,
        assigneeId: formData.assignee === 'unassigned' ? null : formData.assignee,
      });
      setIsSaved(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to update ticket. Please try again.');
      setIsSaved(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Success Confirmation Banner */}
      {isSaved && (
        <div
          role="status"
          className="bg-[#E6F4EA] border border-[#0D8A56]/30 text-[#063F3F] p-4 rounded-xl flex items-start gap-3.5 transition-all shadow-sm"
        >
          <div className="text-[#0D8A56] shrink-0 mt-0.5">
            <CheckCircleIcon size={22} />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-sm text-[#063F3F]">
              Ticket updated successfully.
            </p>
            <p className="text-xs text-[#2A5252] leading-relaxed">
              All modifications have been saved to the database. The form remains accessible with your updated values preserved.
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {submitError && (
        <div
          role="alert"
          className="bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] p-4 rounded-xl flex items-start gap-3.5 transition-all shadow-sm"
        >
          <div className="shrink-0 mt-0.5 font-bold">⚠</div>
          <div className="space-y-1">
            <p className="font-semibold text-sm">Failed to update ticket</p>
            <p className="text-xs leading-relaxed">{submitError}</p>
          </div>
        </div>
      )}

      {/* Responsive Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Ticket Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
              <CardDescription>
                Update the work item title, type, department, and technical specifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Subject Input */}
              <Input
                label="Subject / Work Title *"
                id="edit-ticket-subject"
                value={formData.subject}
                onChange={(e) => handleFieldChange('subject', e.target.value)}
                placeholder="Briefly describe the task or issue..."
                errorMessage={errors.subject}
                aria-required="true"
              />

              {/* Work Type & Department Selects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Ticket Type *"
                  id="edit-ticket-type"
                  value={formData.type}
                  onChange={(e) =>
                    handleFieldChange('type', e.target.value as TicketType)
                  }
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
                  id="edit-ticket-department"
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

              {/* Category Select */}
              <Select
                label="Category *"
                id="edit-ticket-category"
                value={formData.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                errorMessage={errors.category}
                aria-required="true"
              >
                <option value="">Select a category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>

              {/* Project & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Project (Optional)"
                  id="edit-ticket-project"
                  value={formData.project}
                  onChange={(e) => handleFieldChange('project', e.target.value)}
                  placeholder="e.g. Core Infrastructure"
                />

                <Input
                  label="Due Date (Optional)"
                  id="edit-ticket-due-date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                />
              </div>

              {/* Description Textarea */}
              <Textarea
                label="Description *"
                id="edit-ticket-description"
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Provide comprehensive details, steps to reproduce, or instructions..."
                rows={6}
                errorMessage={errors.description}
                aria-required="true"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Meta, Lifecycle & Assignee */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Priority Card */}
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle & Severity</CardTitle>
              <CardDescription>
                Assign resolution priority and ticket lifecycle state.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Priority Select */}
              <Select
                label="Priority *"
                id="edit-ticket-priority"
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

              {/* Status Select */}
              <Select
                label="Status *"
                id="edit-ticket-status"
                value={formData.status}
                onChange={(e) =>
                  handleFieldChange('status', e.target.value as TicketStatus)
                }
                errorMessage={errors.status}
                aria-required="true"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </CardContent>
          </Card>

          {/* Requester & Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Requester & Assignment</CardTitle>
              <CardDescription>
                Assignee technician and customer profile routing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Requester Select */}
              <Select
                label="Requester *"
                id="edit-ticket-requester"
                value={formData.requester}
                onChange={(e) => handleFieldChange('requester', e.target.value)}
                errorMessage={errors.requester}
                aria-required="true"
              >
                <option value="">Select requester...</option>
                {users.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.name} ({req.email})
                  </option>
                ))}
              </Select>

              {/* Assignee Select (Optional) */}
              <Select
                label="Assignee (Optional)"
                id="edit-ticket-assignee"
                value={formData.assignee}
                onChange={(e) => handleFieldChange('assignee', e.target.value)}
                helperText="Leave unassigned if automatic dispatch or triage is preferred."
              >
                <option value="unassigned">Unassigned</option>
                {users.map((asg) => (
                  <option key={asg.id} value={asg.id}>
                    {asg.name} ({asg.email})
                  </option>
                ))}
              </Select>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Card>
            <CardContent className="p-4 md:p-5 space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full justify-center shadow-sm font-semibold"
              >
                Save Changes
              </Button>
              <Link href={`/tickets/${cleanId}`} className="block w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="w-full justify-center"
                >
                  Cancel
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};
