import { Ticket } from '@/types/ticket';
import { RecentActivity } from '@/types/dashboard';

export const CURRENT_AGENT = {
  id: 'usr_002',
  name: 'Marcus Vance',
  email: 'marcus.v@ticketgo.io',
  role: 'agent' as const,
  department: 'Engineering',
  title: 'Lead SRE & Support Specialist',
  status: 'online' as const,
  shift: '08:00 - 17:00 UTC',
  tier: 'Tier 3 Infrastructure',
};

/**
 * Realistic tickets assigned to Marcus Vance across various statuses and priorities.
 */
export const MOCK_AGENT_TICKETS: Ticket[] = [
  {
    id: '#TKT-1048',
    subject: 'Production cluster latency spike and API response degradation in eu-central-1',
    description:
      'Starting at approximately 08:45 UTC, our APM monitoring detected a significant increase in p99 latency across all core checkout microservices hosted in the eu-central-1 region.',
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
  },
  {
    id: '#TKT-1042',
    subject: 'Wildcard SSL certificate expiration warning on staging subdomains',
    description:
      'Automated Let’s Encrypt cert-manager cronjob failed to renew `*.staging.ticketgo.io` due to DNS-01 challenge propagation timeout on Cloudflare API tokens.',
    type: 'incident',
    department: 'IT & Support',
    project: 'Infra SRE & Security',
    dueDate: 'Today, 04:00 PM',
    category: 'Hardware',
    requester: {
      name: 'Omar Farooq',
      email: 'omar.f@cloudscale.net',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'marcus.v@ticketgo.io',
    },
    priority: 'critical',
    status: 'in_progress',
    createdAt: 'Yesterday, 08:15 AM',
    updatedAt: '25 min ago',
  },
  {
    id: '#TKT-1038',
    subject: 'Redis replica synchronization lag causing intermittent cache misses',
    description:
      'Cluster telemetry indicates replication buffer overflow during peak write surges, causing asynchronous read replicas to drop sync and fall back to disk-backed queries.',
    type: 'bug',
    department: 'Engineering',
    project: 'Core Platform v2',
    dueDate: 'Tomorrow, 03:00 PM',
    category: 'Software',
    requester: {
      name: 'Liam Chen',
      email: 'liam.chen@fintech-labs.com',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'marcus.v@ticketgo.io',
    },
    priority: 'high',
    status: 'in_progress',
    createdAt: 'Yesterday, 11:30 AM',
    updatedAt: '1 hour ago',
  },
  {
    id: '#TKT-1043',
    subject: 'Webhook delivery failure on charge.failed customer subscription event',
    description:
      'Stripe webhook listener on endpoint `https://api.acme.com/v1/webhooks/billing` dropped 42 delivery attempts with status 500 Internal Server Error.',
    type: 'bug',
    department: 'Engineering',
    project: 'Payment Gateway',
    dueDate: 'Today, 08:00 PM',
    category: 'Software',
    requester: {
      name: 'Alex Mercer',
      email: 'alex.m@paystream.io',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'marcus.v@ticketgo.io',
    },
    priority: 'medium',
    status: 'open',
    createdAt: 'Yesterday, 09:00 AM',
    updatedAt: '3 hours ago',
  },
  {
    id: '#TKT-1037',
    subject: 'Gateway rate limiter dropping legitimate API requests during traffic bursts',
    description:
      'Token bucket algorithm miscalculated the burst allowance for enterprise clients on plan Tier-Gold, leading to premature HTTP 429 Too Many Requests.',
    type: 'task',
    department: 'Engineering',
    project: 'API Gateway',
    dueDate: 'In 2 days',
    category: 'Technical Support',
    requester: {
      name: 'Elena Rostova',
      email: 'elena.r@enterprise.io',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'marcus.v@ticketgo.io',
    },
    priority: 'high',
    status: 'pending',
    createdAt: '2 days ago',
    updatedAt: '4 hours ago',
  },
  {
    id: '#TKT-1036',
    subject: 'Memory leak in WebSocket real-time notification push worker',
    description:
      'Node.js worker memory consumption ramps from 180MB to 1.8GB over a 12-hour window due to uncleaned socket listeners on client disconnect.',
    type: 'task',
    department: 'Engineering',
    project: 'Realtime Push',
    dueDate: 'Oct 18, 2026',
    category: 'Software',
    requester: {
      name: 'Nathan Drake',
      email: 'nathan.d@infrastructure.io',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'marcus.v@ticketgo.io',
    },
    priority: 'medium',
    status: 'pending',
    createdAt: '2 days ago',
    updatedAt: 'Yesterday',
  },
  {
    id: '#TKT-1035',
    subject: 'PostgreSQL connection pooling configuration tune-up on read-replica',
    description:
      'Adjusted max_connections and configured PgBouncer transaction-mode pool allocation for analytics services.',
    type: 'task',
    department: 'Engineering',
    project: 'Core Platform v2',
    dueDate: 'Completed',
    category: 'Technical Support',
    requester: {
      name: 'David Kim',
      email: 'david.k@cybersecure.org',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'marcus.v@ticketgo.io',
    },
    priority: 'low',
    status: 'resolved',
    createdAt: '3 days ago',
    updatedAt: 'Today, 10:15 AM',
  },
  {
    id: '#TKT-1034',
    subject: 'Automated SSL certificate renewal DNS challenge timeout fix',
    description:
      'Cloudflare API DNS zone token regenerated and tested against cert-manager staging namespace.',
    type: 'task',
    department: 'IT & Support',
    project: 'Infra SRE & Security',
    dueDate: 'Completed',
    category: 'Technical Support',
    requester: {
      name: 'Maya Lin',
      email: 'maya.l@growthstack.com',
    },
    assignee: {
      name: 'Marcus Vance',
      email: 'marcus.v@ticketgo.io',
    },
    priority: 'low',
    status: 'resolved',
    createdAt: '3 days ago',
    updatedAt: 'Today, 09:30 AM',
  },
];

/**
 * Recent agent timeline events for the agent workspace.
 */
export const MOCK_AGENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act_ag_01',
    type: 'assigned',
    actor: {
      name: 'Marcus Vance',
      role: 'Lead SRE',
    },
    description: 'added internal diagnosis comment on',
    ticketId: '#TKT-1048',
    timestamp: '5 min ago',
  },
  {
    id: 'act_ag_02',
    type: 'status_changed',
    actor: {
      name: 'Marcus Vance',
      role: 'Lead SRE',
    },
    description: 'updated API permissions and initiated renewal on',
    ticketId: '#TKT-1042',
    timestamp: '25 min ago',
  },
  {
    id: 'act_ag_03',
    type: 'resolved',
    actor: {
      name: 'Marcus Vance',
      role: 'Lead SRE',
    },
    description: 'marked ticket as Resolved after pool tuning on',
    ticketId: '#TKT-1035',
    timestamp: '2 hours ago',
  },
  {
    id: 'act_ag_04',
    type: 'status_changed',
    actor: {
      name: 'Marcus Vance',
      role: 'Lead SRE',
    },
    description: 'shifted status to Pending awaiting client payload on',
    ticketId: '#TKT-1037',
    timestamp: '4 hours ago',
  },
  {
    id: 'act_ag_05',
    type: 'resolved',
    actor: {
      name: 'Marcus Vance',
      role: 'Lead SRE',
    },
    description: 'verified DNS challenge fix and resolved',
    ticketId: '#TKT-1034',
    timestamp: 'Today, 09:30 AM',
  },
];
