'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BreadcrumbItem, UserRole } from '@/types/navigation';
import { UserProfile } from '@/types/user';
import { getNavigationForRole, DEFAULT_PREVIEW_USER, DynamicNavCounts } from '@/lib/navigation-config';
import { Sidebar } from '@/components/navigation/sidebar';
import { Topbar } from '@/components/navigation/topbar';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';

export interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  user?: UserProfile;
  role?: UserRole;
}

export const AppShell = ({
  children,
  title,
  breadcrumbs,
  user,
  role,
}: AppShellProps) => {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const activeUser = user || auth.user || DEFAULT_PREVIEW_USER;
  const activeRole = role || auth.role || 'admin';

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [navCounts, setNavCounts] = useState<DynamicNavCounts>({});

  // Dynamic live count fetching from real PostgreSQL backend APIs
  const refreshCounts = React.useCallback(async () => {
    if (!auth.isAuthenticated) return;
    try {
      const [notifRes, ticketRes] = await Promise.allSettled([
        api.notifications.unreadCount(),
        api.tickets.list({ limit: 1 }),
      ]);
      const newCounts: DynamicNavCounts = {};
      if (
        notifRes.status === 'fulfilled' &&
        notifRes.value &&
        typeof notifRes.value.unreadCount === 'number'
      ) {
        newCounts.notifications = notifRes.value.unreadCount;
      }
      if (
        ticketRes.status === 'fulfilled' &&
        ticketRes.value?.pagination &&
        typeof ticketRes.value.pagination.totalCount === 'number'
      ) {
        newCounts.tickets = ticketRes.value.pagination.totalCount;
      }
      setNavCounts(newCounts);
    } catch {
      // Non-blocking graceful catch
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      refreshCounts();
    }
    const handleRefresh = () => {
      refreshCounts();
    };
    window.addEventListener('ticketgo:refresh-counts', handleRefresh);
    return () => {
      window.removeEventListener('ticketgo:refresh-counts', handleRefresh);
    };
  }, [refreshCounts, pathname, auth.isAuthenticated]);

  // Auth protection: redirect unauthenticated users to login
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [auth.isLoading, auth.isAuthenticated, router, pathname]);

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Show loading state while checking auth
  if (auth.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F9F7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#6B7F7F] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!auth.isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F9F7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#6B7F7F] font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const sections = getNavigationForRole(activeRole, navCounts);

  return (
    <div className="h-screen overflow-hidden flex bg-[#F3F9F7]">
      {/* Sidebar (Desktop static & Mobile drawer) */}
      <Sidebar
        sections={sections}
        user={activeUser}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <Topbar
          title={title}
          breadcrumbs={breadcrumbs}
          user={activeUser}
          unreadNotificationsCount={navCounts.notifications}
          onOpenMobile={() => setIsMobileOpen(true)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

