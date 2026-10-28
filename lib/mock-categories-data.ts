import { TicketCategory, CategoryCalculatedStats } from '@/types/category';
import { Ticket } from '@/types/ticket';

export const MOCK_CATEGORIES: TicketCategory[] = [
  {
    id: 'cat_tech_support',
    name: 'Technical Support',
    description: 'Hardware diagnostics, OS troubleshooting, peripheral connection errors, and workstation recovery.',
    status: 'active',
    departmentDefault: 'IT & Support',
    createdAt: 'Jan 10, 2024',
  },
  {
    id: 'cat_software_dev',
    name: 'Software Development',
    description: 'Backend API implementation, service refactoring, database migrations, and microservice builds.',
    status: 'active',
    departmentDefault: 'Engineering',
    createdAt: 'Jan 10, 2024',
  },
  {
    id: 'cat_ui_ux',
    name: 'UI/UX Design',
    description: 'Design system components, mobile screen flows, accessibility reviews, and interactive prototypes.',
    status: 'active',
    departmentDefault: 'Design',
    createdAt: 'Jan 15, 2024',
  },
  {
    id: 'cat_marketing',
    name: 'Marketing & Campaigns',
    description: 'Public release collateral, event branding, product landing page copy, and email campaign assets.',
    status: 'active',
    departmentDefault: 'Marketing',
    createdAt: 'Feb 01, 2024',
  },
  {
    id: 'cat_hr',
    name: 'HR & Workplace',
    description: 'Employee onboarding, desk equipment delivery, benefits inquiry, and office relocation assistance.',
    status: 'active',
    departmentDefault: 'HR',
    createdAt: 'Feb 10, 2024',
  },
  {
    id: 'cat_finance',
    name: 'Finance & Operations',
    description: 'Software vendor purchase requests, corporate card receipt reconciliation, and invoicing inquiries.',
    status: 'active',
    departmentDefault: 'Finance & Operations',
    createdAt: 'Feb 15, 2024',
  },
  {
    id: 'cat_account',
    name: 'Account & Access',
    description: 'Okta SSO provisioning, role permission elevation, GitHub organization access, and password resets.',
    status: 'active',
    departmentDefault: 'IT & Support',
    createdAt: 'Jan 12, 2024',
  },
  {
    id: 'cat_security',
    name: 'Security',
    description: 'Phishing alert verification, vulnerability patch reports, compliance reviews, and certificate renewals.',
    status: 'active',
    departmentDefault: 'IT & Support',
    createdAt: 'Jan 20, 2024',
  },
  {
    id: 'cat_infra',
    name: 'Infrastructure',
    description: 'Kubernetes cluster scaling, PgBouncer proxy layer, VPC peering, and Cloudflare routing.',
    status: 'active',
    departmentDefault: 'Engineering',
    createdAt: 'Feb 05, 2024',
  },
  {
    id: 'cat_general',
    name: 'General Request',
    description: 'Standard office inquiries, team equipment questions, and cross-departmental requests.',
    status: 'active',
    departmentDefault: 'IT & Support',
    createdAt: 'Jan 10, 2024',
  },
  {
    id: 'cat_bug',
    name: 'Bug Report',
    description: 'Unexpected platform defects, frontend layout breaks, and API error 5xx regressions.',
    status: 'active',
    departmentDefault: 'Engineering',
    createdAt: 'Jan 10, 2024',
  },
];
 
export const CATEGORY_STATUS_OPTIONS = [
   { value: 'active', label: 'Active' },
   { value: 'inactive', label: 'Inactive' },
 ];

/**
 * Computes live ticket counts for a category from the unified Ticket collection
 */
export function getCategoryStats(categoryName: string, tickets: Ticket[]): CategoryCalculatedStats {
  const normCat = categoryName.toLowerCase().trim();

  // Match category directly or via flexible keyword mapping
  const matchingTickets = tickets.filter((t) => {
    const cat = (t.category || '').toLowerCase().trim();
    if (cat === normCat) return true;
    if (normCat.includes('support') && cat.includes('support')) return true;
    if (normCat.includes('software') && cat.includes('software')) return true;
    if (normCat.includes('design') && (cat.includes('design') || t.department?.toLowerCase() === 'design')) return true;
    if (normCat.includes('marketing') && (cat.includes('marketing') || t.department?.toLowerCase() === 'marketing')) return true;
    if (normCat.includes('hr') && (cat.includes('hr') || t.department?.toLowerCase() === 'hr')) return true;
    if (normCat.includes('finance') && (cat.includes('billing') || cat.includes('finance') || t.department?.toLowerCase().includes('finance'))) return true;
    if (normCat.includes('account') && cat.includes('account')) return true;
    if (normCat.includes('hardware') && cat.includes('hardware')) return true;
    if (normCat.includes('bug') && (t.type === 'bug' || cat.includes('bug'))) return true;
    if (normCat.includes('general') && (t.type === 'general_request' || cat.includes('general'))) return true;
    return false;
  });

  const totalTickets = matchingTickets.length;
  const resolvedTickets = matchingTickets.filter(
    (t) => t.status === 'resolved' || t.status === 'closed'
  ).length;
  const activeTickets = totalTickets - resolvedTickets;

  return {
    totalTickets,
    activeTickets,
    resolvedTickets,
  };
}
