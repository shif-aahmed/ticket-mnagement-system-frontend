import { NavItem, NavSection, UserRole } from '@/types/navigation';
import { UserProfile } from '@/types/user';

/**
 * Master catalog of navigation items across all roles.
 */
export const ALL_NAV_ITEMS: NavItem[] = [
  // Common / Main
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    roles: ['admin', 'agent', 'employee'],
  },
  {
    id: 'agent-workspace',
    label: 'Agent Workspace',
    href: '/agent',
    icon: 'dashboard',
    roles: ['admin', 'agent'],
  },
  {
    id: 'tickets',
    label: 'Tickets',
    href: '/tickets',
    icon: 'tickets',
    roles: ['admin', 'agent'],
  },
  {
    id: 'calendar',
    label: 'Calendar',
    href: '/calendar',
    icon: 'calendar',
    roles: ['admin', 'agent', 'employee'],
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge Base',
    href: '/knowledge-base',
    icon: 'knowledge-base',
    roles: ['admin', 'agent', 'employee'],
  },
  {
    id: 'employee-portal',
    label: 'My Support Portal',
    href: '/employee',
    icon: 'tickets',
    roles: ['employee'],
  },
  {
    id: 'create-ticket',
    label: 'Create Ticket',
    href: '/tickets/create',
    icon: 'plus',
    roles: ['employee'],
  },

  // Management (Admin)
  {
    id: 'users',
    label: 'Users',
    href: '/users',
    icon: 'users',
    roles: ['admin'],
  },
  {
    id: 'teams',
    label: 'Teams',
    href: '/teams',
    icon: 'teams',
    roles: ['admin'],
  },
  {
    id: 'categories',
    label: 'Categories',
    href: '/categories',
    icon: 'categories',
    roles: ['admin'],
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: 'reports',
    roles: ['admin'],
  },

  // General & Utility
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: 'notifications',
    roles: ['admin', 'agent', 'employee'],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: 'settings',
    roles: ['admin', 'agent', 'employee'],
  },
];

export interface DynamicNavCounts {
  tickets?: number;
  notifications?: number;
  [key: string]: number | undefined;
}

/**
 * Returns grouped navigation sections for a given role with real-time dynamic counts.
 * Organizes into Core, Management (if applicable), and Preferences.
 */
export function getNavigationForRole(
  role: UserRole = 'admin',
  counts?: DynamicNavCounts
): NavSection[] {
  const allowedItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => {
    const itemCopy = { ...item };
    if (itemCopy.id === 'notifications') {
      const unread = counts?.notifications;
      itemCopy.badge = unread !== undefined && unread > 0 ? String(unread) : undefined;
      itemCopy.badgeVariant = 'active';
    } else if (itemCopy.id === 'tickets') {
      const ticketCount = counts?.tickets;
      itemCopy.badge = ticketCount !== undefined && ticketCount > 0 ? String(ticketCount) : undefined;
      itemCopy.badgeVariant = 'urgent';
    } else if (counts && counts[itemCopy.id] !== undefined && (counts[itemCopy.id] as number) > 0) {
      itemCopy.badge = String(counts[itemCopy.id]);
    } else {
      itemCopy.badge = undefined;
    }
    return itemCopy;
  });

  const mainIds = [
    'dashboard',
    'agent-workspace',
    'employee-portal',
    'tickets',
    'calendar',
    'knowledge-base',
    'create-ticket',
  ];
  const managementIds = ['users', 'teams', 'categories', 'reports'];
  const utilityIds = ['notifications', 'settings'];

  const mainSection: NavSection = {
    id: 'main',
    title: 'Workspace',
    items: allowedItems.filter((i) => mainIds.includes(i.id)),
  };

  const managementSection: NavSection = {
    id: 'management',
    title: 'Management',
    items: allowedItems.filter((i) => managementIds.includes(i.id)),
  };

  const utilitySection: NavSection = {
    id: 'utility',
    title: 'Preferences',
    items: allowedItems.filter((i) => utilityIds.includes(i.id)),
  };

  const sections: NavSection[] = [mainSection];
  if (managementSection.items.length > 0) {
    sections.push(managementSection);
  }
  if (utilitySection.items.length > 0) {
    sections.push(utilitySection);
  }

  return sections;
}

/**
 * Default preview user profile for development & foundation preview.
 */
export const DEFAULT_PREVIEW_USER: UserProfile = {
  id: 'usr_001',
  name: 'Alex Morgan',
  email: 'alex.morgan@ticketgo.io',
  role: 'admin',
  status: 'online',
  department: 'Engineering',
  title: 'Principal Systems Administrator',
  phone: '+1 (555) 234-5678',
  bio: 'Overseeing global IT systems, service infrastructure, and enterprise access governance across TicketGo.',
  timezone: 'America/New_York (UTC-5)',
};
