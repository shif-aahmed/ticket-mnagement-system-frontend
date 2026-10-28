export type UserRole = 'admin' | 'agent' | 'employee';

export type NavItemBadgeVariant = 'default' | 'success' | 'warning' | 'urgent' | 'active' | 'neutral';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  badgeVariant?: NavItemBadgeVariant;
  roles: UserRole[];
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
