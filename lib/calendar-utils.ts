import { Ticket } from '@/types/ticket';
import {
  CalendarFiltersState,
  CalendarDayCell,
  CalendarDeadlineItem,
} from '@/types/calendar';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_ABBR_MAP: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

/**
 * Formats a Date object to YYYY-MM-DD string key
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Gets human-readable month and year title (e.g., "September 2026")
 */
export function getMonthYearTitle(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

/**
 * Parses a ticket's dueDate string into a normalized Date object.
 * Returns null if the ticket has no dueDate or is marked "Completed".
 */
export function parseTicketDueDate(
  ticket: Ticket,
  referenceDate: Date = new Date()
): Date | null {
  if (!ticket.dueDate) return null;
  const raw = ticket.dueDate.trim();
  const lower = raw.toLowerCase();

  if (lower === 'completed' || lower === 'none' || lower === 'n/a') {
    return null;
  }

  const baseYear = referenceDate.getFullYear();
  const baseMonth = referenceDate.getMonth();
  const baseDay = referenceDate.getDate();

  // 1. Relative: Today
  if (lower.includes('today')) {
    return new Date(baseYear, baseMonth, baseDay);
  }

  // 2. Relative: Tomorrow
  if (lower.includes('tomorrow')) {
    return new Date(baseYear, baseMonth, baseDay + 1);
  }

  // 3. Relative: Yesterday
  if (lower.includes('yesterday')) {
    return new Date(baseYear, baseMonth, baseDay - 1);
  }

  // 4. Relative: In X days
  const inDaysMatch = lower.match(/in\s+(\d+)\s+days?/);
  if (inDaysMatch) {
    const days = parseInt(inDaysMatch[1], 10);
    return new Date(baseYear, baseMonth, baseDay + days);
  }

  // 5. Relative: X days ago / X days overdue
  const pastDaysMatch = lower.match(/(\d+)\s+days?\s+(ago|overdue)/);
  if (pastDaysMatch) {
    const days = parseInt(pastDaysMatch[1], 10);
    return new Date(baseYear, baseMonth, baseDay - days);
  }

  // 6. Explicit Calendar Date: e.g. "Oct 14, 2026" or "October 14, 2026"
  const calendarDateMatch = raw.match(
    /([A-Za-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})?/
  );
  if (calendarDateMatch) {
    const monthKey = calendarDateMatch[1].slice(0, 3).toLowerCase();
    const monthIdx = MONTH_ABBR_MAP[monthKey];
    if (monthIdx !== undefined) {
      const day = parseInt(calendarDateMatch[2], 10);
      const year = calendarDateMatch[3]
        ? parseInt(calendarDateMatch[3], 10)
        : baseYear;
      return new Date(year, monthIdx, day);
    }
  }

  // 7. Fallback standard JavaScript Date.parse
  const parsed = Date.parse(raw);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  return null;
}

/**
 * Filter tickets against local calendar filters
 */
export function filterCalendarTickets(
  tickets: Ticket[],
  filters: CalendarFiltersState
): Ticket[] {
  return tickets.filter((t) => {
    // Exclude tickets without dueDate
    if (!t.dueDate || t.dueDate.toLowerCase() === 'completed') {
      return false;
    }

    // Department filter
    if (filters.department !== 'all' && t.department !== filters.department) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && t.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && t.priority !== filters.priority) {
      return false;
    }

    // Type filter
    if (filters.type !== 'all' && t.type !== filters.type) {
      return false;
    }

    // Assignee filter
    if (filters.assignee !== 'all') {
      const matchesName = t.assignee.name.toLowerCase() === filters.assignee.toLowerCase();
      const matchesEmail = t.assignee.email.toLowerCase() === filters.assignee.toLowerCase();
      if (!matchesName && !matchesEmail) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Generates the full 7-column matrix of days for the specified month and year
 */
export function generateMonthMatrix(
  year: number,
  month: number,
  filteredTickets: Ticket[],
  referenceDate: Date = new Date()
): CalendarDayCell[][] {
  const todayKey = formatDateKey(referenceDate);

  // Group tickets by dateKey
  const ticketMap = new Map<string, Ticket[]>();
  for (const ticket of filteredTickets) {
    const parsedDate = parseTicketDueDate(ticket, referenceDate);
    if (!parsedDate) continue;
    const key = formatDateKey(parsedDate);
    if (!ticketMap.has(key)) {
      ticketMap.set(key, []);
    }
    ticketMap.get(key)!.push(ticket);
  }

  // Month boundary calculations
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const matrix: CalendarDayCell[][] = [];
  let currentWeek: CalendarDayCell[] = [];

  // Previous month padding
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i;
    const date = new Date(year, month - 1, dayNumber);
    const dateKey = formatDateKey(date);
    currentWeek.push({
      date,
      dateKey,
      dayNumber,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      tickets: ticketMap.get(dateKey) || [],
    });
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    currentWeek.push({
      date,
      dateKey,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
      tickets: ticketMap.get(dateKey) || [],
    });

    if (currentWeek.length === 7) {
      matrix.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month padding to fill the final week
  if (currentWeek.length > 0) {
    let nextDay = 1;
    while (currentWeek.length < 7) {
      const date = new Date(year, month + 1, nextDay);
      const dateKey = formatDateKey(date);
      currentWeek.push({
        date,
        dateKey,
        dayNumber: nextDay,
        isCurrentMonth: false,
        isToday: dateKey === todayKey,
        tickets: ticketMap.get(dateKey) || [],
      });
      nextDay++;
    }
    matrix.push(currentWeek);
  }

  // Ensure minimum 5 weeks for uniform height
  while (matrix.length < 5) {
    const lastWeek = matrix[matrix.length - 1];
    const lastDayCell = lastWeek[lastWeek.length - 1];
    const nextWeek: CalendarDayCell[] = [];
    let nextDay = lastDayCell.isCurrentMonth ? 1 : lastDayCell.dayNumber + 1;
    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month + 1, nextDay);
      const dateKey = formatDateKey(date);
      nextWeek.push({
        date,
        dateKey,
        dayNumber: nextDay,
        isCurrentMonth: false,
        isToday: dateKey === todayKey,
        tickets: ticketMap.get(dateKey) || [],
      });
      nextDay++;
    }
    matrix.push(nextWeek);
  }

  return matrix;
}

/**
 * Calculates upcoming deadline tickets (chronologically ordered, not resolved)
 */
export function calculateUpcomingDeadlines(
  tickets: Ticket[],
  referenceDate: Date = new Date()
): CalendarDeadlineItem[] {
  const todayKey = formatDateKey(referenceDate);
  const startOfToday = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  const items: CalendarDeadlineItem[] = [];

  for (const ticket of tickets) {
    // Exclude resolved and closed tickets
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      continue;
    }

    const dueDate = parseTicketDueDate(ticket, referenceDate);
    if (!dueDate) continue;

    const dateKey = formatDateKey(dueDate);

    // If dueDate is today or in the future
    if (dueDate >= startOfToday) {
      const diffMs = dueDate.getTime() - startOfToday.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      let durationLabel = '';
      if (dateKey === todayKey) {
        durationLabel = 'Due Today';
      } else if (diffDays === 1) {
        durationLabel = 'Due Tomorrow';
      } else if (diffDays <= 7) {
        durationLabel = `In ${diffDays} days`;
      } else {
        durationLabel = `${MONTH_NAMES[dueDate.getMonth()].slice(0, 3)} ${dueDate.getDate()}, ${dueDate.getFullYear()}`;
      }

      items.push({
        ticket,
        dueDate,
        dateKey,
        isOverdue: false,
        durationLabel,
        formattedDate: ticket.dueDate || dateKey,
      });
    }
  }

  // Sort by nearest upcoming date first
  items.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return items;
}

/**
 * Calculates overdue deadline tickets (unresolved and dueDate in the past)
 */
export function calculateOverdueDeadlines(
  tickets: Ticket[],
  referenceDate: Date = new Date()
): CalendarDeadlineItem[] {
  const startOfToday = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  const items: CalendarDeadlineItem[] = [];

  for (const ticket of tickets) {
    // Exclude resolved and closed tickets
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      continue;
    }

    const dueDate = parseTicketDueDate(ticket, referenceDate);
    if (!dueDate) continue;

    const dateKey = formatDateKey(dueDate);

    // If dueDate is strictly before today
    if (dueDate < startOfToday) {
      const diffMs = startOfToday.getTime() - dueDate.getTime();
      const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));

      const durationLabel =
        diffDays === 1 ? '1 day overdue' : `${diffDays} days overdue`;

      items.push({
        ticket,
        dueDate,
        dateKey,
        isOverdue: true,
        durationLabel,
        formattedDate: ticket.dueDate || dateKey,
      });
    }
  }

  // Sort by most overdue first (oldest due date first)
  items.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return items;
}
