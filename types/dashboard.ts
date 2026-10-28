import { BadgeVariant } from '@/components/ui/badge';

export type TicketStatus =
  | 'submitted'
  | 'open'
  | 'in_progress'
  | 'pending'
  | 'resolved'
  | 'closed';

export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';

export type StatVariant = 'default' | 'urgent' | 'warning' | 'active' | 'success';

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  changeText: string;
  trend: 'up' | 'down' | 'neutral';
  variant: StatVariant;
  icon: 'layers' | 'tickets' | 'play' | 'clock' | 'check';
}

export interface StatusDistribution {
  status: TicketStatus;
  label: string;
  count: number;
  percentage: number;
  colorClass: string;
  bgClass: string;
  badgeVariant: BadgeVariant;
}

export interface PriorityDistribution {
  priority: TicketPriority;
  label: string;
  count: number;
  percentage: number;
  colorClass: string;
  bgClass: string;
  badgeVariant: BadgeVariant;
}

export interface TicketTypeDistribution {
  id?: string;
  type?: string;
  label: string;
  count: number;
  percentage: number;
  colorClass: string;
  badgeVariant?: BadgeVariant;
}

export interface DepartmentDistribution {
  id?: string;
  department?: string;
  label?: string;
  count: number;
  percentage: number;
  colorClass: string;
}

export interface RecentTicket {
  id: string;
  subject: string;
  type?: string;
  department?: string;
  project?: string;
  dueDate?: string;
  requester: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  priority: TicketPriority;
  status: TicketStatus;
  updatedAt: string;
}

export type ActivityType =
  | 'created'
  | 'assigned'
  | 'status_changed'
  | 'priority_updated'
  | 'resolved';

export interface RecentActivity {
  id: string;
  type: ActivityType;
  actor: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  description: string;
  ticketId?: string;
  timestamp: string;
}
