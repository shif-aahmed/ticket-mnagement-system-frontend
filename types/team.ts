export type WorkloadStatus = 'normal' | 'heavy' | 'critical';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  description: string;
  teamLead: TeamMember;
  members: TeamMember[];
  colorClass: string;
  bgClass: string;
}

export interface TeamCalculatedStats {
  memberCount: number;
  totalTickets: number;
  activeTickets: number;
  resolvedTickets: number;
  overdueTickets: number;
  workloadStatus: WorkloadStatus;
}

export interface TeamSummaryMetric {
  id: string;
  label: string;
  value: number | string;
  changeText?: string;
  variant?: 'default' | 'active' | 'warning' | 'urgent' | 'success';
}

export interface TeamFiltersState {
  search: string;
  workload: WorkloadStatus | 'all';
}
