export type NotificationType =
  | 'ticket_assigned'
  | 'status_changed'
  | 'priority_changed'
  | 'comment_added'
  | 'due_date_approaching'
  | 'ticket_overdue';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  ticketId?: string;
  ticketSubject?: string;
  actor?: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
}

export interface NotificationFiltersState {
  filter: 'all' | 'unread';
  type: 'all' | NotificationType;
}
