import {
  DashboardStat,
  StatusDistribution,
  PriorityDistribution,
  TicketTypeDistribution,
  DepartmentDistribution,
  RecentTicket,
  RecentActivity,
} from '@/types/dashboard';

/**
 * 6 Key Statistics for Unified Organizational Dashboard
 */
export const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: 'total',
    label: 'Total Work & Tickets',
    value: '1,248',
    changeText: '+8.4% vs last month',
    trend: 'up',
    variant: 'default',
    icon: 'layers',
  },
  {
    id: 'open',
    label: 'Open Work',
    value: '186',
    changeText: '18 critical priority',
    trend: 'neutral',
    variant: 'urgent',
    icon: 'tickets',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    value: '94',
    changeText: '24 nearing target date',
    trend: 'neutral',
    variant: 'warning',
    icon: 'play',
  },
  {
    id: 'pending',
    label: 'Pending Approval',
    value: '52',
    changeText: 'Awaiting stakeholder input',
    trend: 'neutral',
    variant: 'active',
    icon: 'clock',
  },
  {
    id: 'resolved',
    label: 'Resolved / Completed',
    value: '916',
    changeText: '97.2% SLA achieved',
    trend: 'up',
    variant: 'success',
    icon: 'check',
  },
  {
    id: 'overdue',
    label: 'Overdue Items',
    value: '14',
    changeText: 'Requires triage attention',
    trend: 'down',
    variant: 'urgent',
    icon: 'clock',
  },
];

/**
 * Status distribution breakdown (Total = 1,248)
 */
export const STATUS_DISTRIBUTION: StatusDistribution[] = [
  {
    status: 'submitted',
    label: 'Submitted',
    count: 42,
    percentage: 3.4,
    colorClass: 'bg-[#64748B]',
    bgClass: 'bg-[#F1F5F9]',
    badgeVariant: 'neutral',
  },
  {
    status: 'open',
    label: 'Open',
    count: 186,
    percentage: 14.9,
    colorClass: 'bg-[#0D9488]',
    bgClass: 'bg-[#CCFBF1]',
    badgeVariant: 'active',
  },
  {
    status: 'in_progress',
    label: 'In Progress',
    count: 94,
    percentage: 7.5,
    colorClass: 'bg-[#F97316]',
    bgClass: 'bg-[#FFEDD5]',
    badgeVariant: 'warning',
  },
  {
    status: 'pending',
    label: 'Pending',
    count: 52,
    percentage: 4.2,
    colorClass: 'bg-[#EAB308]',
    bgClass: 'bg-[#FEF9C3]',
    badgeVariant: 'warning',
  },
  {
    status: 'resolved',
    label: 'Resolved',
    count: 720,
    percentage: 57.7,
    colorClass: 'bg-[#22C55E]',
    bgClass: 'bg-[#DDF4E9]',
    badgeVariant: 'success',
  },
  {
    status: 'closed',
    label: 'Closed',
    count: 154,
    percentage: 12.3,
    colorClass: 'bg-[#94A3B8]',
    bgClass: 'bg-[#F8FAFC]',
    badgeVariant: 'neutral',
  },
];

/**
 * Priority distribution breakdown (Total Open/In-Flight = 186)
 */
export const PRIORITY_DISTRIBUTION: PriorityDistribution[] = [
  {
    priority: 'critical',
    label: 'Critical',
    count: 18,
    percentage: 9.7,
    colorClass: 'bg-[#EF4444]',
    bgClass: 'bg-[#FEE2E2]',
    badgeVariant: 'urgent',
  },
  {
    priority: 'high',
    label: 'High',
    count: 46,
    percentage: 24.7,
    colorClass: 'bg-[#F97316]',
    bgClass: 'bg-[#FFEDD5]',
    badgeVariant: 'warning',
  },
  {
    priority: 'medium',
    label: 'Medium',
    count: 82,
    percentage: 44.1,
    colorClass: 'bg-[#0D9488]',
    bgClass: 'bg-[#CCFBF1]',
    badgeVariant: 'active',
  },
  {
    priority: 'low',
    label: 'Low',
    count: 40,
    percentage: 21.5,
    colorClass: 'bg-[#64748B]',
    bgClass: 'bg-[#F1F5F9]',
    badgeVariant: 'neutral',
  },
];

/**
 * Unified Ticket Types Breakdown (Total = 1,248)
 */
export const TICKET_TYPE_DISTRIBUTION: TicketTypeDistribution[] = [
  {
    type: 'task',
    label: 'Tasks',
    count: 420,
    percentage: 33.7,
    colorClass: 'bg-[#0D9488]',
    badgeVariant: 'active',
  },
  {
    type: 'support_request',
    label: 'Support Requests',
    count: 380,
    percentage: 30.4,
    colorClass: 'bg-[#0284C7]',
    badgeVariant: 'active',
  },
  {
    type: 'bug',
    label: 'Bugs',
    count: 192,
    percentage: 15.4,
    colorClass: 'bg-[#F97316]',
    badgeVariant: 'warning',
  },
  {
    type: 'incident',
    label: 'Incidents',
    count: 148,
    percentage: 11.9,
    colorClass: 'bg-[#EF4444]',
    badgeVariant: 'urgent',
  },
  {
    type: 'general_request',
    label: 'General Requests',
    count: 108,
    percentage: 8.6,
    colorClass: 'bg-[#64748B]',
    badgeVariant: 'neutral',
  },
];

/**
 * Department Distribution Breakdown across Organization
 */
export const DEPARTMENT_DISTRIBUTION: DepartmentDistribution[] = [
  {
    department: 'Engineering',
    count: 482,
    percentage: 38.6,
    colorClass: 'bg-[#063F3F]',
  },
  {
    department: 'IT & Support',
    count: 346,
    percentage: 27.7,
    colorClass: 'bg-[#0D9488]',
  },
  {
    department: 'Marketing',
    count: 132,
    percentage: 10.6,
    colorClass: 'bg-[#EC4899]',
  },
  {
    department: 'Design',
    count: 114,
    percentage: 9.1,
    colorClass: 'bg-[#8B5CF6]',
  },
  {
    department: 'Finance & Operations',
    count: 88,
    percentage: 7.1,
    colorClass: 'bg-[#10B981]',
  },
  {
    department: 'HR',
    count: 86,
    percentage: 6.9,
    colorClass: 'bg-[#F59E0B]',
  },
];

/**
 * Realistic recent tickets across organizational domains
 */
export const RECENT_TICKETS: RecentTicket[] = [
  {
    id: '#TKT-1050',
    subject: 'Create responsive dashboard analytics card components and tokens',
    type: 'Task',
    department: 'Design',
    project: 'Design System 2.0',
    dueDate: 'In 3 days',
    requester: {
      name: 'Maya Lin',
      email: 'maya.l@growthstack.com',
    },
    priority: 'high',
    status: 'in_progress',
    updatedAt: '12m ago',
  },
  {
    id: '#TKT-1049',
    subject: 'Prepare Q4 enterprise customer product launch campaign assets',
    type: 'Task',
    department: 'Marketing',
    project: 'Q4 Growth Campaign',
    dueDate: 'Oct 22, 2026',
    requester: {
      name: 'Rachel Green',
      email: 'rachel.g@retailhub.co',
    },
    priority: 'medium',
    status: 'open',
    updatedAt: '18m ago',
  },
  {
    id: '#TKT-1048',
    subject: 'Production cluster latency spike in eu-central-1',
    type: 'Incident',
    department: 'Engineering',
    project: 'Core Platform v2',
    dueDate: 'Today, 06:00 PM',
    requester: {
      name: 'Sarah Connor',
      email: 'sarah.c@acme-corp.com',
    },
    priority: 'critical',
    status: 'open',
    updatedAt: '8m ago',
  },
  {
    id: '#TKT-1047',
    subject: 'OAuth2 refresh token expiry loop on iOS app v4.2',
    type: 'Bug',
    department: 'Engineering',
    project: 'Mobile App v4',
    dueDate: 'Tomorrow, 05:00 PM',
    requester: {
      name: 'Marcus Vance',
      email: 'marcus.v@cloudscale.net',
    },
    priority: 'high',
    status: 'in_progress',
    updatedAt: '24m ago',
  },
  {
    id: '#TKT-1046',
    subject: 'SCIM user provisioning sync failure for enterprise domain',
    type: 'Task',
    department: 'IT & Support',
    project: 'Infra SRE & Security',
    dueDate: 'Oct 15, 2026',
    requester: {
      name: 'Elena Rostova',
      email: 'elena.r@enterprise.io',
    },
    priority: 'high',
    status: 'pending',
    updatedAt: '1h ago',
  },
  {
    id: '#TKT-1045',
    subject: 'Request for annual SOC2 Type II compliance audit package',
    type: 'General Request',
    department: 'Finance & Operations',
    project: 'SOC2 Compliance',
    dueDate: 'Oct 14, 2026',
    requester: {
      name: 'David Kim',
      email: 'david.k@fintech-labs.com',
    },
    priority: 'medium',
    status: 'resolved',
    updatedAt: '2h ago',
  },
];

/**
 * Realistic recent audit / activity events across the organization
 */
export const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act_001',
    type: 'resolved',
    actor: {
      name: 'Alex Morgan',
      role: 'Admin',
    },
    description: 'marked ticket as resolved with compliance audit package',
    ticketId: '#TKT-1045',
    timestamp: '12m ago',
  },
  {
    id: 'act_002',
    type: 'status_changed',
    actor: {
      name: 'Elena Rostova',
      role: 'UI Designer',
    },
    description: 'moved design sprint task #TKT-1050 to In Progress',
    ticketId: '#TKT-1050',
    timestamp: '15m ago',
  },
  {
    id: 'act_003',
    type: 'created',
    actor: {
      name: 'Rachel Green',
      role: 'Marketing Lead',
    },
    description: 'created campaign deliverable ticket #TKT-1049',
    ticketId: '#TKT-1049',
    timestamp: '18m ago',
  },
  {
    id: 'act_004',
    type: 'created',
    actor: {
      name: 'Automated Monitor',
      role: 'System Bot',
    },
    description: 'generated high-priority incident for cluster latency',
    ticketId: '#TKT-1048',
    timestamp: '35m ago',
  },
  {
    id: 'act_005',
    type: 'priority_updated',
    actor: {
      name: 'Sarah Jenkins',
      role: 'Support Agent',
    },
    description: 'escalated priority level from Medium to High',
    ticketId: '#TKT-1046',
    timestamp: '1h ago',
  },
  {
    id: 'act_006',
    type: 'assigned',
    actor: {
      name: 'Alex Morgan',
      role: 'Operations Lead',
    },
    description: 'assigned contractor SSO onboarding ticket to HR team',
    ticketId: '#TKT-1018',
    timestamp: '3h ago',
  },
];
