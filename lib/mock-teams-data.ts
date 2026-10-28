import { Team, TeamCalculatedStats, WorkloadStatus } from '@/types/team';
import { Ticket } from '@/types/ticket';

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team_eng',
    name: 'Engineering',
    department: 'Engineering',
    description: 'Core backend, frontend web architecture, API gateway, SRE, and cloud infrastructure.',
    teamLead: {
      id: 'usr_006',
      name: 'Sarah Connor',
      email: 'sarah.c@acme-corp.com',
      role: 'Staff DevOps Lead',
    },
    members: [
      { id: 'usr_006', name: 'Sarah Connor', email: 'sarah.c@acme-corp.com', role: 'Staff DevOps Lead' },
      { id: 'usr_002', name: 'Marcus Vance', email: 'marcus.v@ticketgo.io', role: 'Senior Fullstack Engineer' },
      { id: 'usr_008', name: 'Devin Thorne', email: 'devin.t@ticketgo.io', role: 'Infrastructure SRE' },
      { id: 'usr_009', name: 'Liam Chen', email: 'liam.c@ticketgo.io', role: 'Backend Services Engineer' },
      { id: 'usr_010', name: 'Amara Patel', email: 'amara.p@ticketgo.io', role: 'Frontend Platform Lead' },
    ],
    colorClass: 'text-[#063F3F]',
    bgClass: 'bg-[#EBF5EE]',
  },
  {
    id: 'team_design',
    name: 'Design',
    department: 'Design',
    description: 'Product UI/UX, design system tokens, design review workflows, and accessible interactive prototypes.',
    teamLead: {
      id: 'usr_003',
      name: 'Elena Rostova',
      email: 'elena.r@ticketgo.io',
      role: 'Head of Product Design',
    },
    members: [
      { id: 'usr_003', name: 'Elena Rostova', email: 'elena.r@ticketgo.io', role: 'Head of Product Design' },
      { id: 'usr_011', name: 'Maya Lin', email: 'maya.l@ticketgo.io', role: 'Senior Product Designer' },
      { id: 'usr_012', name: 'Carlos Mendez', email: 'carlos.m@ticketgo.io', role: 'UI Systems Specialist' },
      { id: 'usr_013', name: 'Zoe Kravitz', email: 'zoe.k@ticketgo.io', role: 'User Research Specialist' },
    ],
    colorClass: 'text-[#7C3AED]',
    bgClass: 'bg-[#EDE9FE]',
  },
  {
    id: 'team_it',
    name: 'IT & Support',
    department: 'IT & Support',
    description: 'Enterprise hardware fleet, identity & SSO access, corporate VPN gateways, and helpdesk operations.',
    teamLead: {
      id: 'usr_001',
      name: 'Alex Morgan',
      email: 'alex.morgan@ticketgo.io',
      role: 'Director of IT & Security',
    },
    members: [
      { id: 'usr_001', name: 'Alex Morgan', email: 'alex.morgan@ticketgo.io', role: 'Director of IT & Security' },
      { id: 'usr_004', name: 'Sarah Jenkins', email: 'sarah.j@ticketgo.io', role: 'IT Support Specialist' },
      { id: 'usr_014', name: 'Ethan Hunt', email: 'ethan.h@ticketgo.io', role: 'Endpoint Systems Admin' },
      { id: 'usr_015', name: 'Nadia Ray', email: 'nadia.r@ticketgo.io', role: 'Identity & Access Specialist' },
    ],
    colorClass: 'text-[#0D9488]',
    bgClass: 'bg-[#CCFBF1]',
  },
  {
    id: 'team_marketing',
    name: 'Marketing',
    department: 'Marketing',
    description: 'Growth campaigns, product marketing releases, brand assets, social collateral, and external webinars.',
    teamLead: {
      id: 'usr_004',
      name: 'Sarah Jenkins',
      email: 'sarah.j@ticketgo.io',
      role: 'Brand & Growth Marketing Lead',
    },
    members: [
      { id: 'usr_004', name: 'Sarah Jenkins', email: 'sarah.j@ticketgo.io', role: 'Brand & Growth Marketing Lead' },
      { id: 'usr_016', name: 'Oliver Twist', email: 'oliver.t@ticketgo.io', role: 'Content Strategy Manager' },
      { id: 'usr_017', name: 'Chloe Bennett', email: 'chloe.b@ticketgo.io', role: 'Digital Campaigns Specialist' },
    ],
    colorClass: 'text-[#DB2777]',
    bgClass: 'bg-[#FCE7F3]',
  },
  {
    id: 'team_hr',
    name: 'HR & Workplace',
    department: 'HR',
    description: 'People operations, employee onboarding, benefits enrollment, workplace ergonomics, and talent recruitment.',
    teamLead: {
      id: 'usr_018',
      name: 'Rachel Green',
      email: 'rachel.g@ticketgo.io',
      role: 'Head of People Operations',
    },
    members: [
      { id: 'usr_018', name: 'Rachel Green', email: 'rachel.g@ticketgo.io', role: 'Head of People Operations' },
      { id: 'usr_019', name: 'Harvey Specter', email: 'harvey.s@ticketgo.io', role: 'Talent Acquisition Partner' },
      { id: 'usr_020', name: 'Donna Paulsen', email: 'donna.p@ticketgo.io', role: 'Workplace Operations Lead' },
    ],
    colorClass: 'text-[#059669]',
    bgClass: 'bg-[#D1FAE5]',
  },
  {
    id: 'team_fin',
    name: 'Finance & Operations',
    department: 'Finance & Operations',
    description: 'Corporate procurement, invoice reconciliation, vendor compliance, expense filing, and financial planning.',
    teamLead: {
      id: 'usr_005',
      name: 'David Kim',
      email: 'david.k@fintech-labs.com',
      role: 'Operations & Finance Manager',
    },
    members: [
      { id: 'usr_005', name: 'David Kim', email: 'david.k@fintech-labs.com', role: 'Operations & Finance Manager' },
      { id: 'usr_021', name: 'Jessica Pearson', email: 'jessica.p@ticketgo.io', role: 'Procurement Director' },
      { id: 'usr_022', name: 'Louis Litt', email: 'louis.l@ticketgo.io', role: 'Financial Controller' },
    ],
    colorClass: 'text-[#D97706]',
    bgClass: 'bg-[#FEF3C7]',
  },
];

/**
 * Dynamically computes real-time stats from the unified TicketGo tickets collection
 */
export function getTeamStats(team: Team, tickets: Ticket[]): TeamCalculatedStats {
  const teamTickets = tickets.filter(
    (t) =>
      t.department?.toLowerCase() === team.department.toLowerCase() ||
      t.department?.toLowerCase() === team.name.toLowerCase()
  );

  const totalTickets = teamTickets.length;
  const resolvedTickets = teamTickets.filter(
    (t) => t.status === 'resolved' || t.status === 'closed'
  ).length;
  const activeTickets = totalTickets - resolvedTickets;

  // Compute overdue tickets
  const overdueTickets = teamTickets.filter((t) => {
    if (t.status === 'resolved' || t.status === 'closed') return false;
    if (t.priority === 'critical') return true;
    if (t.dueDate?.toLowerCase().includes('today') || t.dueDate?.toLowerCase().includes('overdue')) return true;
    return false;
  }).length;

  let workloadStatus: WorkloadStatus = 'normal';
  if (activeTickets >= 3 || overdueTickets >= 2) {
    workloadStatus = 'critical';
  } else if (activeTickets >= 1) {
    workloadStatus = 'heavy';
  }

  return {
    memberCount: team.members.length,
    totalTickets,
    activeTickets,
    resolvedTickets,
    overdueTickets,
    workloadStatus,
  };
}

/**
 * Returns tickets associated with a given team
 */
export function getTeamTickets(team: Team, tickets: Ticket[]): Ticket[] {
  return tickets.filter(
    (t) =>
      t.department?.toLowerCase() === team.department.toLowerCase() ||
      t.department?.toLowerCase() === team.name.toLowerCase()
  );
}
