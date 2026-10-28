import { BadgeVariant } from '@/components/ui/badge';

export type ReportsDateRange = '7d' | '30d' | '90d' | 'ytd' | 'all';

export interface ReportsFiltersState {
  dateRange: ReportsDateRange;
  department: string | 'all';
  status: string | 'all';
  priority: string | 'all';
  type: string | 'all';
  category: string | 'all';
}

export interface ReportsSummaryMetric {
  id: string;
  label: string;
  value: string | number;
  changeText?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'urgent' | 'warning' | 'active' | 'success';
}

export interface ReportsTrendPoint {
  label: string;
  created: number;
  resolved: number;
}

export interface ReportsDistributionItem {
  id: string;
  label: string;
  count: number;
  percentage: number;
  colorClass: string;
  badgeVariant?: BadgeVariant;
  secondaryCount?: number;
}

export interface AssigneeWorkloadSummary {
  name: string;
  email: string;
  department: string;
  activeTickets: number;
  resolvedTickets: number;
  overdueTickets: number;
  capacityRate: number; // 0 - 100 percentage
}

export interface ReportsCalculatedData {
  totalCount: number;
  summaryMetrics: ReportsSummaryMetric[];
  trendPoints: ReportsTrendPoint[];
  statusDistribution: ReportsDistributionItem[];
  priorityDistribution: ReportsDistributionItem[];
  typeDistribution: ReportsDistributionItem[];
  departmentDistribution: ReportsDistributionItem[];
  categoryDistribution: ReportsDistributionItem[];
  assigneeWorkload: AssigneeWorkloadSummary[];
  overdueCount: number;
  criticalCount: number;
  slaRate: number;
}
