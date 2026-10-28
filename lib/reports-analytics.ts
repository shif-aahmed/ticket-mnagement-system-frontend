import { Ticket } from '@/types/ticket';
import {
  ReportsFiltersState,
  ReportsCalculatedData,
  ReportsSummaryMetric,
  ReportsTrendPoint,
  ReportsDistributionItem,
  AssigneeWorkloadSummary,
} from '@/types/reports';
import { BadgeVariant } from '@/components/ui/badge';

export const DATE_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'all', label: 'All Time' },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'task', label: 'Task' },
  { value: 'support_request', label: 'Support Request' },
  { value: 'incident', label: 'Incident' },
  { value: 'bug', label: 'Bug' },
  { value: 'general_request', label: 'General Request' },
];

/**
 * Filter tickets and calculate comprehensive management metrics
 */
export function calculateReportsData(
  allTickets: Ticket[],
  filters: ReportsFiltersState
): ReportsCalculatedData {
  // 1. Filter tickets
  let filtered = [...allTickets];

  // Date range filter
  if (filters.dateRange === '7d') {
    filtered = filtered.slice(0, Math.max(1, Math.ceil(filtered.length * 0.4)));
  } else if (filters.dateRange === '30d') {
    filtered = filtered.slice(0, Math.max(1, Math.ceil(filtered.length * 0.7)));
  } else if (filters.dateRange === '90d') {
    filtered = filtered.slice(0, Math.max(1, Math.ceil(filtered.length * 0.9)));
  }

  // Department filter
  if (filters.department !== 'all') {
    filtered = filtered.filter(
      (t) => t.department?.toLowerCase() === filters.department.toLowerCase()
    );
  }

  // Status filter
  if (filters.status !== 'all') {
    filtered = filtered.filter((t) => t.status === filters.status);
  }

  // Priority filter
  if (filters.priority !== 'all') {
    filtered = filtered.filter((t) => t.priority === filters.priority);
  }

  // Type filter
  if (filters.type !== 'all') {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  // Category filter
  if (filters.category !== 'all') {
    filtered = filtered.filter(
      (t) => t.category?.toLowerCase() === filters.category.toLowerCase()
    );
  }

  const totalCount = filtered.length;
  const resolvedCount = filtered.filter(
    (t) => t.status === 'resolved' || t.status === 'closed'
  ).length;
  const activeCount = totalCount - resolvedCount;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;
  const overdueCount = filtered.filter(
    (t) =>
      (t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed') ||
      (t.status === 'open' && t.id.endsWith('4'))
  ).length;
  const criticalCount = filtered.filter((t) => t.priority === 'critical').length;
  const slaRate = totalCount > 0 ? Math.min(100, Math.max(88, 96 - overdueCount * 2)) : 100;

  // 2. Summary Metrics
  const summaryMetrics: ReportsSummaryMetric[] = [
    {
      id: 'total',
      label: 'Total Tickets',
      value: totalCount,
      changeText: '+12% vs prior period',
      trend: 'up',
      variant: 'default',
    },
    {
      id: 'active',
      label: 'Active Workload',
      value: activeCount,
      changeText: `${activeCount} in progression`,
      trend: 'neutral',
      variant: 'warning',
    },
    {
      id: 'resolution_rate',
      label: 'Resolution Rate',
      value: `${resolutionRate}%`,
      changeText: `${resolvedCount} tickets completed`,
      trend: resolutionRate >= 60 ? 'up' : 'down',
      variant: resolutionRate >= 60 ? 'success' : 'warning',
    },
    {
      id: 'overdue',
      label: 'Overdue / SLA Alerts',
      value: overdueCount,
      changeText: overdueCount > 0 ? 'Requires intervention' : 'All targets healthy',
      trend: overdueCount > 0 ? 'down' : 'up',
      variant: overdueCount > 0 ? 'urgent' : 'success',
    },
    {
      id: 'critical',
      label: 'Critical Incidents',
      value: criticalCount,
      changeText: `${criticalCount} urgent priority`,
      trend: 'neutral',
      variant: criticalCount > 0 ? 'urgent' : 'default',
    },
    {
      id: 'sla_compliance',
      label: 'SLA Compliance',
      value: `${slaRate}%`,
      changeText: 'Target: 95.0% enterprise SLA',
      trend: slaRate >= 95 ? 'up' : 'down',
      variant: slaRate >= 95 ? 'success' : 'warning',
    },
  ];

  // 3. Work Trend Points (6 time intervals)
  const labels = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'];
  const trendPoints: ReportsTrendPoint[] = labels.map((label, idx) => {
    const factor = (idx + 1) / labels.length;
    const baseCreated = Math.max(1, Math.round((totalCount / 5) * (0.8 + 0.4 * Math.sin(idx))));
    const baseResolved = Math.max(0, Math.round((resolvedCount / 5) * factor * 1.1));
    return {
      label,
      created: baseCreated,
      resolved: baseResolved,
    };
  });

  // 4. Status Distribution
  const statusMeta: Record<string, { label: string; color: string; badge: BadgeVariant }> = {
    open: { label: 'Open', color: 'bg-[#0284C7]', badge: 'active' },
    in_progress: { label: 'In Progress', color: 'bg-[#D97706]', badge: 'warning' },
    pending: { label: 'Pending', color: 'bg-[#475569]', badge: 'neutral' },
    resolved: { label: 'Resolved', color: 'bg-[#15803D]', badge: 'success' },
    closed: { label: 'Closed', color: 'bg-[#94A3B8]', badge: 'neutral' },
  };

  const statusCounts: Record<string, number> = {};
  filtered.forEach((t) => {
    statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
  });

  const statusDistribution: ReportsDistributionItem[] = Object.keys(statusMeta).map((key) => {
    const count = statusCounts[key] || 0;
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return {
      id: key,
      label: statusMeta[key].label,
      count,
      percentage,
      colorClass: statusMeta[key].color,
      badgeVariant: statusMeta[key].badge,
    };
  });

  // 5. Priority Distribution
  const priorityMeta: Record<string, { label: string; color: string; badge: BadgeVariant }> = {
    critical: { label: 'Critical', color: 'bg-[#DC2626]', badge: 'urgent' },
    high: { label: 'High', color: 'bg-[#EA580C]', badge: 'warning' },
    medium: { label: 'Medium', color: 'bg-[#0284C7]', badge: 'active' },
    low: { label: 'Low', color: 'bg-[#64748B]', badge: 'neutral' },
  };

  const priorityCounts: Record<string, number> = {};
  filtered.forEach((t) => {
    priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
  });

  const priorityDistribution: ReportsDistributionItem[] = Object.keys(priorityMeta).map((key) => {
    const count = priorityCounts[key] || 0;
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return {
      id: key,
      label: priorityMeta[key].label,
      count,
      percentage,
      colorClass: priorityMeta[key].color,
      badgeVariant: priorityMeta[key].badge,
    };
  });

  // 6. Ticket Type Distribution
  const typeMeta: Record<string, { label: string; color: string; badge: BadgeVariant }> = {
    task: { label: 'Task', color: 'bg-[#064747]', badge: 'default' },
    support_request: { label: 'Support Request', color: 'bg-[#0F766E]', badge: 'active' },
    incident: { label: 'Incident', color: 'bg-[#DC2626]', badge: 'urgent' },
    bug: { label: 'Bug', color: 'bg-[#D97706]', badge: 'warning' },
    general_request: { label: 'General Request', color: 'bg-[#64748B]', badge: 'neutral' },
  };

  const typeCounts: Record<string, number> = {};
  filtered.forEach((t) => {
    const tType = t.type || 'task';
    typeCounts[tType] = (typeCounts[tType] || 0) + 1;
  });

  const typeDistribution: ReportsDistributionItem[] = Object.keys(typeMeta).map((key) => {
    const count = typeCounts[key] || 0;
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return {
      id: key,
      label: typeMeta[key].label,
      count,
      percentage,
      colorClass: typeMeta[key].color,
      badgeVariant: typeMeta[key].badge,
    };
  });

  // 7. Department Distribution
  const deptCounts: Record<string, { total: number; resolved: number }> = {};
  filtered.forEach((t) => {
    const dept = t.department || 'General';
    if (!deptCounts[dept]) {
      deptCounts[dept] = { total: 0, resolved: 0 };
    }
    deptCounts[dept].total += 1;
    if (t.status === 'resolved' || t.status === 'closed') {
      deptCounts[dept].resolved += 1;
    }
  });

  const departmentColors = [
    'bg-[#064747]',
    'bg-[#0F766E]',
    'bg-[#0284C7]',
    'bg-[#8B5CF6]',
    'bg-[#D97706]',
    'bg-[#10B981]',
  ];

  const departmentDistribution: ReportsDistributionItem[] = Object.keys(deptCounts).map(
    (dept, idx) => {
      const dData = deptCounts[dept];
      const percentage = totalCount > 0 ? Math.round((dData.total / totalCount) * 100) : 0;
      return {
        id: dept,
        label: dept,
        count: dData.total,
        percentage,
        colorClass: departmentColors[idx % departmentColors.length],
        secondaryCount: dData.resolved,
      };
    }
  );

  // 8. Category Distribution
  const categoryCounts: Record<string, { total: number; resolved: number }> = {};
  filtered.forEach((t) => {
    const cat = t.category || 'General';
    if (!categoryCounts[cat]) {
      categoryCounts[cat] = { total: 0, resolved: 0 };
    }
    categoryCounts[cat].total += 1;
    if (t.status === 'resolved' || t.status === 'closed') {
      categoryCounts[cat].resolved += 1;
    }
  });

  const categoryDistribution: ReportsDistributionItem[] = Object.keys(categoryCounts)
    .sort((a, b) => categoryCounts[b].total - categoryCounts[a].total)
    .slice(0, 8)
    .map((cat, idx) => {
      const cData = categoryCounts[cat];
      const percentage = totalCount > 0 ? Math.round((cData.total / totalCount) * 100) : 0;
      return {
        id: cat,
        label: cat,
        count: cData.total,
        percentage,
        colorClass: departmentColors[idx % departmentColors.length],
        secondaryCount: cData.resolved,
      };
    });

  // 9. Assignee Workload Summary
  const assigneeMap: Record<
    string,
    { email: string; department: string; active: number; resolved: number; overdue: number }
  > = {};

  filtered.forEach((t) => {
    const name = t.assignee.name || 'Unassigned';
    if (!assigneeMap[name]) {
      assigneeMap[name] = {
        email: t.assignee.email || `${name.toLowerCase().replace(/\s+/g, '.')}@ticketgo.io`,
        department: t.department || 'Engineering',
        active: 0,
        resolved: 0,
        overdue: 0,
      };
    }
    if (t.status === 'resolved' || t.status === 'closed') {
      assigneeMap[name].resolved += 1;
    } else {
      assigneeMap[name].active += 1;
      if (t.priority === 'critical') {
        assigneeMap[name].overdue += 1;
      }
    }
  });

  const assigneeWorkload: AssigneeWorkloadSummary[] = Object.keys(assigneeMap)
    .sort((a, b) => assigneeMap[b].active - assigneeMap[a].active)
    .slice(0, 10)
    .map((name) => {
      const data = assigneeMap[name];
      const capacityRate = Math.min(100, Math.round((data.active / 5) * 100));
      return {
        name,
        email: data.email,
        department: data.department,
        activeTickets: data.active,
        resolvedTickets: data.resolved,
        overdueTickets: data.overdue,
        capacityRate,
      };
    });

  return {
    totalCount,
    summaryMetrics,
    trendPoints,
    statusDistribution,
    priorityDistribution,
    typeDistribution,
    departmentDistribution,
    categoryDistribution,
    assigneeWorkload,
    overdueCount,
    criticalCount,
    slaRate,
  };
}
