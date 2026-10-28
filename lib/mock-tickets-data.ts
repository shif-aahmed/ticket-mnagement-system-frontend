import { Ticket, TicketSummaryMetric, TicketType } from '@/types/ticket';

/**
 * 5 Compact Ticket Summary Metrics
 */
export const TICKET_SUMMARY_METRICS: TicketSummaryMetric[] = [
  { id: 'all', label: 'All Tickets', count: '1,248' },
  { id: 'open', label: 'Open', count: '186', status: 'open' },
  { id: 'in_progress', label: 'In Progress', count: '94', status: 'in_progress' },
  { id: 'pending', label: 'Pending', count: '52', status: 'pending' },
  { id: 'resolved', label: 'Resolved', count: '916', status: 'resolved' },
];

/**
 * 10 Realistic Enterprise Tickets with Details & History
 */
export const MOCK_TICKETS: Ticket[] = [
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
    id: '#TKT-1050',
    subject: 'Create responsive dashboard analytics card components and tokens',
    description:
      'Design and document high-density operational metric cards, CSS progress indicators, and status badges for the v2.0 design system. Ensure full WCAG 2.1 AA color contrast and independent scrolling behavior.',
    type: 'task',
    department: 'Design',
    project: 'Design System 2.0',
    dueDate: 'In 3 days',
    category: 'Software',
    requester: {
      name: 'Maya Lin',
      email: 'maya.l@growthstack.com',
    },
    assignee: {
      name: 'Elena Rostova',
      email: 'elena.r@ticketgo.io',
    },
    priority: 'high',
    status: 'in_progress',
    createdAt: 'Today, 09:30 AM',
    updatedAt: '12 min ago',
    activityHistory: [
      {
        id: 'act_1050_1',
        type: 'created',
        actor: { name: 'Maya Lin', role: 'Product Lead' },
        description: 'created design sprint ticket for analytics cards',
        timestamp: 'Today, 09:30 AM',
      },
      {
        id: 'act_1050_2',
        type: 'assigned',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'assigned to Elena Rostova (Design & UI)',
        timestamp: 'Today, 09:35 AM',
      },
      {
        id: 'act_1050_3',
        type: 'status_updated',
        actor: { name: 'Elena Rostova', role: 'UI Specialist' },
        description: 'moved status to In Progress; shared Figma spec',
        timestamp: '12 min ago',
      },
    ],
  },
  {
    id: '#TKT-1049',
    subject: 'Prepare Q4 enterprise customer product launch campaign assets',
    description:
      'Draft multi-channel email announcements, update documentation banners, and coordinate scheduled marketing releases for the enterprise product rollout.',
    type: 'task',
    department: 'Marketing',
    project: 'Q4 Growth Campaign',
    dueDate: 'Oct 22, 2026',
    category: 'General',
    requester: {
      name: 'Rachel Green',
      email: 'rachel.g@retailhub.co',
    },
    assignee: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@ticketgo.io',
    },
    priority: 'medium',
    status: 'open',
    createdAt: 'Today, 09:00 AM',
    updatedAt: '18 min ago',
    activityHistory: [
      {
        id: 'act_1049_1',
        type: 'created',
        actor: { name: 'Rachel Green', role: 'Marketing Manager' },
        description: 'submitted marketing campaign deliverable ticket',
        timestamp: 'Today, 09:00 AM',
      },
    ],
  },
  {
    id: '#TKT-1048',
    subject: 'Production cluster latency spike and API response degradation in eu-central-1',
    description:
      'Starting at approximately 08:45 UTC, our APM monitoring detected a significant increase in p99 latency across all core checkout microservices hosted in the eu-central-1 region. Latency escalated from a baseline of 42ms to over 1,850ms, causing intermittent 504 Gateway Timeout errors for European customers. Initial telemetry points to connection pooling saturation on the primary read replica following a scheduled configuration deployment.',
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
    id: '#TKT-1047',
    subject: 'OAuth2 refresh token expiry loop in iOS application v4.2',
    description:
      'Several enterprise mobile users have reported being forcefully signed out of the iOS client (build 4.2.140) every 15 minutes. When the app attempts to perform silent background token renewal against the `/oauth/v2/token` endpoint, an `invalid_grant` error is returned due to a clock skew discrepancy between the client JWT validator and the identity provider.',
    type: 'bug',
    department: 'Engineering',
    project: 'Mobile App v4',
    dueDate: 'Tomorrow, 05:00 PM',
    category: 'Software',
    requester: {
      name: 'Liam Chen',
      email: 'liam.chen@fintech-labs.com',
    },
    assignee: {
      name: 'Elena Rostova',
      email: 'elena.r@ticketgo.io',
    },
    priority: 'high',
    status: 'in_progress',
    createdAt: 'Today, 07:15 AM',
    updatedAt: '24 min ago',
    attachments: [
      {
        id: 'att_03',
        name: 'ios_oauth_network_dump.har',
        size: 524288,
        formattedSize: '512.0 KB',
      },
    ],
    activityHistory: [
      {
        id: 'act_1047_1',
        type: 'created',
        actor: { name: 'Liam Chen', role: 'Mobile Engineering' },
        description: 'submitted ticket regarding token expiration loop',
        timestamp: 'Today, 07:15 AM',
      },
      {
        id: 'act_1047_2',
        type: 'assigned',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'assigned ticket to Elena Rostova',
        timestamp: 'Today, 07:30 AM',
      },
      {
        id: 'act_1047_3',
        type: 'status_updated',
        actor: { name: 'Elena Rostova', role: 'Identity Specialist' },
        description: 'shifted status from Open to In Progress',
        timestamp: '24 min ago',
      },
    ],
  },
  {
    id: '#TKT-1046',
    subject: 'SCIM user provisioning synchronization failure for enterprise tenant domain',
    description:
      'Okta SCIM synchronization integration stopped syncing deprovisioned accounts for corporate tenant `acme-corp.com`. New user invites are succeeding, but offboarded employees retain active session tokens in the directory service. Error logs indicate HTTP 422 Unprocessable Entity during batch user deletion.',
    type: 'task',
    department: 'IT & Support',
    project: 'Infra SRE & Security',
    dueDate: 'Oct 15, 2026',
    category: 'Account & Access',
    requester: {
      name: 'Elena Rostova',
      email: 'elena.r@enterprise.io',
    },
    assignee: {
      name: 'Alex Morgan',
      email: 'alex.m@ticketgo.io',
    },
    priority: 'high',
    status: 'pending',
    createdAt: 'Today, 06:20 AM',
    updatedAt: '1 hour ago',
    attachments: [
      {
        id: 'att_04',
        name: 'okta_scim_sync_errors.json',
        size: 98304,
        formattedSize: '96.0 KB',
      },
    ],
    activityHistory: [
      {
        id: 'act_1046_1',
        type: 'created',
        actor: { name: 'Elena Rostova', role: 'IT Administrator' },
        description: 'submitted SCIM synchronization report',
        timestamp: 'Today, 06:20 AM',
      },
      {
        id: 'act_1046_2',
        type: 'status_updated',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'marked ticket as Pending awaiting Okta SCIM payload schema update from client',
        timestamp: '1 hour ago',
      },
    ],
  },
  {
    id: '#TKT-1045',
    subject: 'Annual SOC2 Type II compliance audit report export request',
    description:
      'External security auditor requested verified access to SOC2 Type II compliance artifacts, penetration testing executive summaries, and quarterly access review logs for calendar year 2025.',
    type: 'general_request',
    department: 'Finance & Operations',
    project: 'SOC2 Compliance',
    dueDate: 'Oct 14, 2026',
    category: 'General',
    requester: {
      name: 'David Kim',
      email: 'david.k@cybersecure.org',
    },
    assignee: {
      name: 'Alex Morgan',
      email: 'alex.m@ticketgo.io',
    },
    priority: 'medium',
    status: 'resolved',
    createdAt: 'Yesterday, 02:00 PM',
    updatedAt: '2 hours ago',
    attachments: [
      {
        id: 'att_05',
        name: 'soc2_type_ii_audit_package_2025.pdf',
        size: 4718592,
        formattedSize: '4.5 MB',
      },
    ],
    activityHistory: [
      {
        id: 'act_1045_1',
        type: 'created',
        actor: { name: 'David Kim', role: 'Audit Lead' },
        description: 'submitted document retrieval ticket',
        timestamp: 'Yesterday, 02:00 PM',
      },
      {
        id: 'act_1045_2',
        type: 'comment_added',
        actor: { name: 'Alex Morgan', role: 'Security Compliance' },
        description: 'attached verified audit package and NDA acknowledgment',
        timestamp: '2 hours ago',
        comment: 'Compliance artifacts securely uploaded. All auditor questions have been resolved.',
      },
      {
        id: 'act_1045_3',
        type: 'status_updated',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'marked ticket as Resolved',
        timestamp: '2 hours ago',
      },
    ],
  },
  {
    id: '#TKT-1044',
    subject: 'Corporate invoice billing discrepancy and VAT registration number change',
    description:
      'Finance department identified that tax invoice #INV-9201 omitted the updated European VAT number following our legal corporate entity migration. Requesting reissuance with correct fiscal entity identifiers.',
    type: 'general_request',
    department: 'Finance & Operations',
    project: 'Finance Audit',
    dueDate: 'Completed',
    category: 'Billing',
    requester: {
      name: 'Rachel Green',
      email: 'rachel.g@retailhub.co',
    },
    assignee: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@ticketgo.io',
    },
    priority: 'low',
    status: 'closed',
    createdAt: 'Yesterday, 11:30 AM',
    updatedAt: '4 hours ago',
    activityHistory: [
      {
        id: 'act_1044_1',
        type: 'created',
        actor: { name: 'Rachel Green', role: 'Billing Contact' },
        description: 'submitted invoice correction request',
        timestamp: 'Yesterday, 11:30 AM',
      },
      {
        id: 'act_1044_2',
        type: 'status_updated',
        actor: { name: 'Sarah Jenkins', role: 'Finance Ops' },
        description: 'reissued credit note and updated billing VAT profile; closed ticket',
        timestamp: '4 hours ago',
      },
    ],
  },
  {
    id: '#TKT-1043',
    subject: 'Webhook delivery failure on charge.failed customer subscription event',
    description:
      'Stripe webhook listener on endpoint `https://api.acme.com/v1/webhooks/billing` dropped 42 delivery attempts with status 500 Internal Server Error due to an unhandled null exception on currency symbol parsing.',
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
    updatedAt: '5 hours ago',
    activityHistory: [
      {
        id: 'act_1043_1',
        type: 'created',
        actor: { name: 'Alex Mercer', role: 'Developer' },
        description: 'submitted webhook failure logs',
        timestamp: 'Yesterday, 09:00 AM',
      },
    ],
  },
  {
    id: '#TKT-1042',
    subject: 'Wildcard SSL certificate expiration warning on staging subdomains',
    description:
      'Automated Let’s Encrypt cert-manager cronjob failed to renew `*.staging.ticketgo.io` due to DNS-01 challenge propagation timeout on Cloudflare API tokens.',
    type: 'incident',
    department: 'IT & Support',
    project: 'Infra SRE & Security',
    dueDate: 'Yesterday, 04:00 PM',
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
    updatedAt: '6 hours ago',
    activityHistory: [
      {
        id: 'act_1042_1',
        type: 'created',
        actor: { name: 'Omar Farooq', role: 'Infra SRE' },
        description: 'reported SSL certificate renewal failure',
        timestamp: 'Yesterday, 08:15 AM',
      },
      {
        id: 'act_1042_2',
        type: 'status_updated',
        actor: { name: 'Marcus Vance', role: 'Lead SRE' },
        description: 'updated API token permissions and triggered manual renew',
        timestamp: '6 hours ago',
      },
    ],
  },
  {
    id: '#TKT-1041',
    subject: 'Okta SAML 2.0 Single Sign-On (SSO) authentication handshake failure',
    description:
      'Single Sign-On authentication stopped working after identity provider certificate rotation. Users receiving "Invalid assertion consumer service URL" on login redirect.',
    type: 'support_request',
    department: 'IT & Support',
    project: 'SSO Migration',
    dueDate: 'Oct 16, 2026',
    category: 'Account & Access',
    requester: {
      name: 'Devin Brooks',
      email: 'devin.b@enterprise.io',
    },
    assignee: {
      name: 'Elena Rostova',
      email: 'elena.r@ticketgo.io',
    },
    priority: 'high',
    status: 'submitted',
    createdAt: 'Yesterday, 07:00 AM',
    updatedAt: 'Yesterday',
    activityHistory: [
      {
        id: 'act_1041_1',
        type: 'created',
        actor: { name: 'Devin Brooks', role: 'Identity Admin' },
        description: 'submitted ticket regarding certificate rotation',
        timestamp: 'Yesterday, 07:00 AM',
      },
    ],
  },
  {
    id: '#TKT-1040',
    subject: 'Email notification delivery bounce rate exceeding normal SLA thresholds',
    description:
      'SendGrid outgoing transaction emails experienced a 4.2% bounce rate due to missing DMARC alignment on customer subdomain delegations.',
    type: 'support_request',
    department: 'Marketing',
    project: 'Q4 Growth Campaign',
    dueDate: 'Completed',
    category: 'Technical Support',
    requester: {
      name: 'Maya Lin',
      email: 'maya.l@growthstack.com',
    },
    assignee: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@ticketgo.io',
    },
    priority: 'medium',
    status: 'resolved',
    createdAt: '2 days ago',
    updatedAt: 'Yesterday',
    activityHistory: [
      {
        id: 'act_1040_1',
        type: 'created',
        actor: { name: 'Maya Lin', role: 'Customer Success' },
        description: 'reported email bounce rate spike',
        timestamp: '2 days ago',
      },
      {
        id: 'act_1040_2',
        type: 'status_updated',
        actor: { name: 'Sarah Jenkins', role: 'Support Agent' },
        description: 'verified DMARC record update and confirmed bounce rate normalized to <0.1%',
        timestamp: 'Yesterday',
      },
    ],
  },
  {
    id: '#TKT-1039',
    subject: 'PostgreSQL database connection pool exhaustion during peak hourly sync',
    description:
      'Scheduled background cron tasks caused connection pool starvation on primary database cluster during 12:00 UTC hourly warehouse ingest.',
    type: 'incident',
    department: 'Engineering',
    project: 'Core Platform v2',
    dueDate: 'Completed',
    category: 'Technical Support',
    requester: {
      name: 'Nathan Drake',
      email: 'nathan.d@infrastructure.io',
    },
    assignee: {
      name: 'Alex Morgan',
      email: 'alex.m@ticketgo.io',
    },
    priority: 'critical',
    status: 'resolved',
    createdAt: '3 days ago',
    updatedAt: '2 days ago',
    activityHistory: [
      {
        id: 'act_1039_1',
        type: 'created',
        actor: { name: 'Nathan Drake', role: 'DBA' },
        description: 'created incident ticket for connection pool starvation',
        timestamp: '3 days ago',
      },
      {
        id: 'act_1039_2',
        type: 'status_updated',
        actor: { name: 'Alex Morgan', role: 'Admin' },
        description: 'adjusted PgBouncer pool sizing and staggered hourly cron jobs',
        timestamp: '2 days ago',
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
 * Mock Requesters for Ticket Creation
 */
export const MOCK_REQUESTERS = [
  { id: 'req_001', name: 'Sarah Connor', email: 'sarah.c@acme-corp.com' },
  { id: 'req_002', name: 'Liam Chen', email: 'liam.chen@fintech-labs.com' },
  { id: 'req_003', name: 'Elena Rostova', email: 'elena.r@enterprise.io' },
  { id: 'req_004', name: 'David Kim', email: 'david.k@cybersecure.org' },
  { id: 'req_005', name: 'Rachel Green', email: 'rachel.g@retailhub.co' },
  { id: 'req_006', name: 'Alex Mercer', email: 'alex.m@paystream.io' },
  { id: 'req_007', name: 'Omar Farooq', email: 'omar.f@cloudscale.net' },
  { id: 'req_008', name: 'Devin Brooks', email: 'devin.b@enterprise.io' },
  { id: 'req_009', name: 'Maya Lin', email: 'maya.l@growthstack.com' },
  { id: 'req_010', name: 'Nathan Drake', email: 'nathan.d@infrastructure.io' },
];

/**
 * Ticket Categories
 */
export const MOCK_CATEGORIES = [
  'Technical Support',
  'Account & Access',
  'Billing',
  'Hardware',
  'Software',
  'General',
];

/**
 * Ticket Priorities
 */
export const MOCK_PRIORITIES: { value: 'low' | 'medium' | 'high' | 'critical'; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

/**
 * Mock Assignees (including unassigned)
 */
export const MOCK_ASSIGNEES = [
  { id: 'unassigned', name: 'Unassigned', email: '' },
  { id: 'asg_001', name: 'Marcus Vance', email: 'marcus.v@ticketgo.io' },
  { id: 'asg_002', name: 'Elena Rostova', email: 'elena.r@ticketgo.io' },
  { id: 'asg_003', name: 'Alex Morgan', email: 'alex.m@ticketgo.io' },
  { id: 'asg_004', name: 'Sarah Jenkins', email: 'sarah.j@ticketgo.io' },
  { id: 'asg_005', name: 'David Kim', email: 'david.k@fintech-labs.com' },
];

/**
 * Ticket Statuses
 */
export const MOCK_STATUSES: { value: 'submitted' | 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'; label: string }[] = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

/**
 * Unified Ticket Types
 */
export const TICKET_TYPES: { value: TicketType; label: string }[] = [
  { value: 'task', label: 'Task' },
  { value: 'support_request', label: 'Support Request' },
  { value: 'incident', label: 'Incident' },
  { value: 'bug', label: 'Bug' },
  { value: 'general_request', label: 'General Request' },
];

/**
 * Organizational Departments
 */
export const TICKET_DEPARTMENTS: string[] = [
  'Engineering',
  'IT & Support',
  'Design',
  'Marketing',
  'HR',
  'Finance & Operations',
];

/**
 * Common Organization Projects (Optional context)
 */
export const MOCK_PROJECTS: string[] = [
  'Core Platform v2',
  'Mobile App v4',
  'Design System 2.0',
  'Q4 Growth Campaign',
  'Infra SRE & Security',
  'SOC2 Compliance',
  'Team Onboarding',
];


