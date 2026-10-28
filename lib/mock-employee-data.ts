import { Ticket } from '@/types/ticket';
import { RecentActivity } from '@/types/dashboard';

/**
 * Current mock employee identity (Sarah Connor - DevOps Lead)
 */
export const CURRENT_EMPLOYEE = {
  id: 'usr_006',
  name: 'Sarah Connor',
  email: 'sarah.c@acme-corp.com',
  role: 'employee' as const,
  department: 'Engineering',
  title: 'DevOps Lead',
  status: 'online' as const,
  phone: '+1 (555) 789-0123',
};

/**
 * Realistic set of tickets submitted by Sarah Connor across all statuses & priorities.
 */
export const MOCK_EMPLOYEE_TICKETS: Ticket[] = [
  {
    id: '#TKT-1051',
    subject: 'Deploy production PgBouncer connection pooler in us-east-1',
    description:
      'Provision HA PgBouncer proxy layer in front of primary Aurora PostgreSQL cluster to resolve replica connection starvation and optimize connection pooling.',
    type: 'task',
    department: 'Engineering',
    project: 'Core Platform v2',
    dueDate: 'In 4 days',
    category: 'Technical Support',
    requester: {
      name: 'Alex Morgan',
      email: 'alex.m@ticketgo.io',
    },
    assignee: {
      name: 'Sarah Connor',
      email: 'sarah.c@acme-corp.com',
    },
    priority: 'high',
    status: 'in_progress',
    createdAt: 'Yesterday, 02:00 PM',
    updatedAt: '45 min ago',
    activityHistory: [
      {
        id: 'act_1051_1',
        type: 'created',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'assigned infrastructure task to DevOps Lead Sarah Connor',
        timestamp: 'Yesterday, 02:00 PM',
      },
    ],
  },
  {
    id: '#TKT-1048',
    subject: 'Production cluster latency spike and API response degradation in eu-central-1',
    description:
      'Starting at approximately 08:45 UTC, our APM monitoring detected a significant increase in p99 latency across all core checkout microservices hosted in the eu-central-1 region. Latency escalated from a baseline of 42ms to over 1,850ms, causing intermittent 504 Gateway Timeout errors.',
    type: 'incident',
    department: 'Engineering',
    project: 'Core Platform v2',
    dueDate: 'Today, 06:00 PM',
    category: 'Technical Support',
    requester: {
      name: 'Sarah Connor',
      email: 'sarah.c@acme-corp.com',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'marcus.v@ticketgo.io',
    },
    priority: 'critical',
    status: 'open',
    createdAt: 'Today, 08:50 AM',
    updatedAt: '5 min ago',
    attachments: [
      {
        id: 'att_01',
        name: 'cluster_latency_flamegraph.svg',
        size: 348160,
        formattedSize: '340.0 KB',
      },
      {
        id: 'att_02',
        name: 'postgresql_pool_exhaustion.log',
        size: 1258291,
        formattedSize: '1.2 MB',
      },
    ],
    activityHistory: [
      {
        id: 'act_1048_1',
        type: 'created',
        actor: { name: 'Sarah Connor', role: 'DevOps Lead' },
        description: 'created incident ticket via automated Datadog webhook trigger',
        timestamp: 'Today, 08:50 AM',
      },
      {
        id: 'act_1048_2',
        type: 'priority_changed',
        actor: { name: 'Automated Bot', role: 'System Monitor' },
        description: 'escalated priority level to Critical based on p99 threshold breach (>1500ms)',
        timestamp: 'Today, 08:52 AM',
      },
      {
        id: 'act_1048_3',
        type: 'assigned',
        actor: { name: 'Alex Morgan', role: 'Duty Manager' },
        description: 'assigned ticket to Marcus Vance (Infrastructure Tier 3)',
        timestamp: 'Today, 08:55 AM',
      },
      {
        id: 'act_1048_4',
        type: 'comment_added',
        actor: { name: 'Marcus Vance', role: 'Lead SRE' },
        description: 'added internal diagnosis comment',
        timestamp: '5 min ago',
        comment:
          'Reproduced the pool exhaustion on replica nodes. Increasing max_connections and draining hanging transactions now.',
      },
    ],
  },
  {
    id: '#TKT-1035',
    subject: 'Kubernetes staging cluster node autoscaling failure during load tests',
    description:
      'During automated peak load verification on the staging cluster, Karpenter node provisioner failed to spawn m6i.xlarge instances due to AWS EC2 instance limit quota on the sub-account.',
    type: 'task',
    department: 'Engineering',
    project: 'Core Platform v2',
    dueDate: 'Tomorrow, 02:00 PM',
    category: 'Technical Support',
    requester: {
      name: 'Sarah Connor',
      email: 'sarah.c@acme-corp.com',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'marcus.v@ticketgo.io',
    },
    priority: 'high',
    status: 'open',
    createdAt: 'Today, 09:15 AM',
    updatedAt: '35 min ago',
    attachments: [
      {
        id: 'att_e1',
        name: 'karpenter_provisioner_errors.log',
        size: 142300,
        formattedSize: '138.9 KB',
      },
    ],
    activityHistory: [
      {
        id: 'act_1035_1',
        type: 'created',
        actor: { name: 'Sarah Connor', role: 'DevOps Lead' },
        description: 'submitted ticket regarding staging autoscaler quotas',
        timestamp: 'Today, 09:15 AM',
      },
      {
        id: 'act_1035_2',
        type: 'assigned',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'assigned ticket to Marcus Vance',
        timestamp: 'Today, 09:20 AM',
      },
    ],
  },
  {
    id: '#TKT-1033',
    subject: 'VPN gateway split-tunnel DNS resolution failure for internal domains',
    description:
      'Connecting via WireGuard internal VPN drops internal resolution for `*.internal.acme.corp`. External DNS continues functioning, but intranet dashboards and CI runners become unreachable.',
    type: 'support_request',
    department: 'IT & Support',
    project: 'Infra SRE & Security',
    dueDate: 'In 2 days',
    category: 'Account & Access',
    requester: {
      name: 'Sarah Connor',
      email: 'sarah.c@acme-corp.com',
    },
    assignee: {
      name: 'Elena Rostova',
      email: 'elena.r@ticketgo.io',
    },
    priority: 'high',
    status: 'in_progress',
    createdAt: 'Yesterday, 03:20 PM',
    updatedAt: '1 hour ago',
    attachments: [
      {
        id: 'att_e2',
        name: 'wireguard_client_diag.txt',
        size: 45056,
        formattedSize: '44.0 KB',
      },
    ],
    activityHistory: [
      {
        id: 'act_1033_1',
        type: 'created',
        actor: { name: 'Sarah Connor', role: 'DevOps Lead' },
        description: 'submitted VPN split-tunnel DNS diagnostics',
        timestamp: 'Yesterday, 03:20 PM',
      },
      {
        id: 'act_1033_2',
        type: 'assigned',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'assigned ticket to Elena Rostova',
        timestamp: 'Yesterday, 03:45 PM',
      },
      {
        id: 'act_1033_3',
        type: 'status_updated',
        actor: { name: 'Elena Rostova', role: 'IT & Security' },
        description: 'shifted status from Open to In Progress',
        timestamp: '1 hour ago',
      },
    ],
  },
  {
    id: '#TKT-1029',
    subject: 'Request for production Terraform state lock release on DynamoDB table',
    description:
      'CI/CD pipeline step timed out during terraform apply on the payment-gateway module, leaving an active state lock with ID `49a23-8cbf-4410`. Need administrative state release after verifying lock expiry.',
    type: 'task',
    department: 'Engineering',
    project: 'Infra SRE & Security',
    dueDate: 'Oct 18, 2026',
    category: 'Software',
    requester: {
      name: 'Sarah Connor',
      email: 'sarah.c@acme-corp.com',
    },
    assignee: {
      name: 'Alex Morgan',
      email: 'alex.m@ticketgo.io',
    },
    priority: 'medium',
    status: 'pending',
    createdAt: 'Yesterday, 10:40 AM',
    updatedAt: '2 hours ago',
    activityHistory: [
      {
        id: 'act_1029_1',
        type: 'created',
        actor: { name: 'Sarah Connor', role: 'DevOps Lead' },
        description: 'requested manual state unlocking after CI timeout',
        timestamp: 'Yesterday, 10:40 AM',
      },
      {
        id: 'act_1029_2',
        type: 'status_updated',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'marked ticket as Pending awaiting verification from DevOps team',
        timestamp: '2 hours ago',
      },
    ],
  },
  {
    id: '#TKT-1024',
    subject: 'Harbor container registry storage quota upgrade for release artifacts',
    description:
      'Internal container registry volume reached 94% storage capacity. Requesting quota extension from 500GB to 1TB on the persistent storage class to support Q3 release candidate builds.',
    type: 'general_request',
    department: 'IT & Support',
    project: 'Infra SRE & Security',
    dueDate: 'Completed',
    category: 'Hardware',
    requester: {
      name: 'Sarah Connor',
      email: 'sarah.c@acme-corp.com',
    },
    assignee: {
      name: 'Alex Morgan',
      email: 'alex.m@ticketgo.io',
    },
    priority: 'low',
    status: 'resolved',
    createdAt: '2 days ago',
    updatedAt: 'Yesterday, 04:30 PM',
    activityHistory: [
      {
        id: 'act_1024_1',
        type: 'created',
        actor: { name: 'Sarah Connor', role: 'DevOps Lead' },
        description: 'submitted volume expansion request for Harbor registry',
        timestamp: '2 days ago',
      },
      {
        id: 'act_1024_2',
        type: 'comment_added',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'expanded PVC storage volume to 1TB',
        timestamp: 'Yesterday, 04:15 PM',
        comment: 'Storage class PVC resized to 1TB. Filesystem online expansion complete.',
      },
      {
        id: 'act_1024_3',
        type: 'status_updated',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'marked ticket as Resolved',
        timestamp: 'Yesterday, 04:30 PM',
      },
    ],
  },
  {
    id: '#TKT-1018',
    subject: 'GitHub Enterprise SAML SSO license allocation for new contractor seats',
    description:
      'Provisioned 4 external contractor accounts requiring access to the core infrastructure repositories. Need seat allocation on GitHub Enterprise and assignment to `devops-external` team.',
    type: 'task',
    department: 'HR',
    project: 'Team Onboarding',
    dueDate: 'Completed',
    category: 'Account & Access',
    requester: {
      name: 'Sarah Connor',
      email: 'sarah.c@acme-corp.com',
    },
    assignee: {
      name: 'Elena Rostova',
      email: 'elena.r@ticketgo.io',
    },
    priority: 'medium',
    status: 'resolved',
    createdAt: '4 days ago',
    updatedAt: '3 days ago',
    activityHistory: [
      {
        id: 'act_1018_1',
        type: 'created',
        actor: { name: 'Sarah Connor', role: 'DevOps Lead' },
        description: 'requested contractor SSO license provisioning',
        timestamp: '4 days ago',
      },
      {
        id: 'act_1018_2',
        type: 'status_updated',
        actor: { name: 'Elena Rostova', role: 'IT & Security' },
        description: 'allocated licenses and invited contractors to team; marked as Resolved',
        timestamp: '3 days ago',
      },
    ],
  },
];

/**
 * Recent ticket events specific to Sarah Connor's submitted tickets.
 */
export const MOCK_EMPLOYEE_ACTIVITIES: RecentActivity[] = [
  {
    id: 'emp_act_1',
    type: 'created',
    actor: {
      name: 'Sarah Connor',
      role: 'Employee (DevOps Lead)',
    },
    description: 'submitted ticket for production cluster latency spike',
    ticketId: '#TKT-1048',
    timestamp: 'Today, 08:50 AM',
  },
  {
    id: 'emp_act_2',
    type: 'assigned',
    actor: {
      name: 'Marcus Vance',
      role: 'Lead SRE',
    },
    description: 'was assigned to your ticket',
    ticketId: '#TKT-1048',
    timestamp: 'Today, 08:55 AM',
  },
  {
    id: 'emp_act_3',
    type: 'created',
    actor: {
      name: 'Sarah Connor',
      role: 'Employee (DevOps Lead)',
    },
    description: 'submitted staging node autoscaling quota ticket',
    ticketId: '#TKT-1035',
    timestamp: 'Today, 09:15 AM',
  },
  {
    id: 'emp_act_4',
    type: 'status_changed',
    actor: {
      name: 'Elena Rostova',
      role: 'Support Agent',
    },
    description: 'moved ticket to In Progress (investigating WireGuard routes)',
    ticketId: '#TKT-1033',
    timestamp: '1 hour ago',
  },
  {
    id: 'emp_act_5',
    type: 'status_changed',
    actor: {
      name: 'Marcus Vance',
      role: 'Lead SRE',
    },
    description: 'added internal diagnosis comment: "Reproduced pool exhaustion, increasing limit"',
    ticketId: '#TKT-1048',
    timestamp: '5 min ago',
  },
  {
    id: 'emp_act_6',
    type: 'resolved',
    actor: {
      name: 'Alex Morgan',
      role: 'Admin',
    },
    description: 'resolved storage quota expansion ticket after PVC resizing',
    ticketId: '#TKT-1024',
    timestamp: 'Yesterday, 04:30 PM',
  },
];
