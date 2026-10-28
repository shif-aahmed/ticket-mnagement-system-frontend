import { UserRole } from './navigation';

export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  status?: UserStatus;
  department?: string;
  title?: string;
  phone?: string;
  bio?: string;
  timezone?: string;
}

export type AdminUserRole = 'administrator' | 'agent' | 'employee';
export type AdminUserStatus = 'active' | 'inactive';

export interface AdminUserActivity {
  lastAction: string;
  timestamp: string;
  ticketCount?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: AdminUserRole;
  department: string;
  status: AdminUserStatus;
  lastActive: string;
  createdAt: string;
  phone?: string;
  activity?: AdminUserActivity;
}

export interface UserFiltersState {
  search: string;
  role: AdminUserRole | 'all';
  status: AdminUserStatus | 'all';
}

export interface UserSummaryMetric {
  id: string;
  label: string;
  count: number | string;
  role?: AdminUserRole;
  status?: AdminUserStatus;
}

export interface UserFormData {
  name: string;
  email: string;
  role: AdminUserRole;
  department: string;
  status: AdminUserStatus;
}

export type UserFormErrors = Partial<Record<keyof UserFormData, string>>;

