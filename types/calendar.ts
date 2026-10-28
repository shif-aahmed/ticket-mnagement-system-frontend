import { Ticket, TicketPriority, TicketStatus, TicketType } from '@/types/ticket';

export interface CalendarFiltersState {
  department: string;
  status: TicketStatus | 'all';
  priority: TicketPriority | 'all';
  type: TicketType | 'all';
  assignee: string; // 'all' or assignee name/email
}

export interface CalendarDayCell {
  date: Date;
  dateKey: string; // 'YYYY-MM-DD'
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tickets: Ticket[];
}

export interface CalendarDeadlineItem {
  ticket: Ticket;
  dueDate: Date;
  dateKey: string;
  isOverdue: boolean;
  durationLabel: string;
  formattedDate: string;
}

export interface CalendarMonthData {
  year: number;
  month: number; // 0-11
  monthName: string;
  weeks: CalendarDayCell[][];
  scheduledTicketsCount: number;
  upcomingCount: number;
  overdueCount: number;
}
