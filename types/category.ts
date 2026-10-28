export type CategoryStatus = 'active' | 'inactive';

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
  departmentDefault: string;
  createdAt: string;
}

export interface CategoryCalculatedStats {
  totalTickets: number;
  activeTickets: number;
  resolvedTickets: number;
}

export interface CategorySummaryMetric {
  id: string;
  label: string;
  value: number | string;
  changeText?: string;
  variant?: 'default' | 'active' | 'warning' | 'urgent' | 'success';
}

export interface CategoryFiltersState {
  search: string;
  status: CategoryStatus | 'all';
  department: string | 'all';
}

export interface CategoryFormData {
  name: string;
  description: string;
  departmentDefault: string;
  status: CategoryStatus;
}

export type CategoryFormErrors = Partial<Record<keyof CategoryFormData, string>>;
