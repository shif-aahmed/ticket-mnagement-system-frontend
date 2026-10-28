import { TicketPriority, TicketStatus } from '@/types/dashboard';

export type { TicketPriority, TicketStatus };

export type TicketType =
  | 'task'
  | 'support_request'
  | 'incident'
  | 'bug'
  | 'general_request';

export interface TicketUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  formattedSize: string;
}

export interface TicketHistoryEvent {
  id: string;
  type: 'created' | 'assigned' | 'priority_changed' | 'status_updated' | 'comment_added';
  actor: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  description: string;
  timestamp: string;
  comment?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description?: string;
  type?: TicketType;
  department?: string;
  project?: string;
  dueDate?: string;
  category?: string;
  requester: TicketUser;
  assignee: TicketUser;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt?: string;
  updatedAt: string;
  attachments?: AttachmentFile[];
  activityHistory?: TicketHistoryEvent[];
}

export interface TicketFiltersState {
  search: string;
  status: TicketStatus | 'all';
  priority: TicketPriority | 'all';
  assignee: string | 'all';
  type?: TicketType | 'all';
  department?: string | 'all';
}

export interface TicketSummaryMetric {
  id: string;
  label: string;
  count: string;
  status?: TicketStatus;
}

export interface CreateTicketFormData {
  subject: string;
  description: string;
  type: TicketType;
  department: string;
  project?: string;
  dueDate?: string;
  requester: string;
  category: string;
  priority: TicketPriority;
  assignee: string;
  attachments: AttachmentFile[];
}

export type CreateTicketFormErrors = Partial<Record<keyof CreateTicketFormData, string>>;

export interface EditTicketFormData {
  subject: string;
  description: string;
  type: TicketType;
  department: string;
  project?: string;
  dueDate?: string;
  requester: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string;
}

export type EditTicketFormErrors = Partial<Record<keyof EditTicketFormData, string>>;

