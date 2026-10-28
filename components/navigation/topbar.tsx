'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BreadcrumbItem } from '@/types/navigation';
import { UserProfile } from '@/types/user';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { Badge } from '@/components/ui/badge';
import {
  MenuIcon,
  SearchIcon,
  ChevronRightIcon,
  SettingsIcon,
  UsersIcon,
  LogOutIcon,
} from '@/components/ui/icons';
import { GlobalSearchModal } from '@/components/search/global-search-modal';
import { TopbarNotificationsPopover } from '@/components/notifications/topbar-notifications-popover';
import { NotificationItem } from '@/types/notification';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';

export interface TopbarProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  user: UserProfile;
  unreadNotificationsCount?: number;
  onOpenMobile: () => void;
}

export const Topbar = ({
  title,
  breadcrumbs,
  user,
  onOpenMobile,
}: TopbarProps) => {
  const { logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const fetchTopbarNotifications = React.useCallback(() => {
    let isMounted = true;
    api.notifications
      .list({ limit: 10 })
      .then((res) => {
        if (isMounted && res && Array.isArray(res.items)) {
          setNotifications(res.items);
        }
      })
      .catch(() => {
        // Fallback gracefully
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch real notifications on mount and on custom refresh event
  useEffect(() => {
    const cleanup = fetchTopbarNotifications();
    const handleRefresh = () => {
      fetchTopbarNotifications();
    };
    window.addEventListener('ticketgo:refresh-counts', handleRefresh);
    return () => {
      cleanup?.();
      window.removeEventListener('ticketgo:refresh-counts', handleRefresh);
    };
  }, [fetchTopbarNotifications]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close profile menu on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.notifications.markAllRead();
      window.dispatchEvent(new Event('ticketgo:refresh-counts'));
    } catch {
      // Non-blocking
    }
  };

  const handleToggleNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
    try {
      await api.notifications.markRead(id);
      window.dispatchEvent(new Event('ticketgo:refresh-counts'));
    } catch {
      // Non-blocking
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-[#E5EDE9] shrink-0">
        {/* Left Area: Mobile Menu Trigger + Breadcrumbs / Page Title */}
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          {/* Mobile Hamburger Trigger */}
          <IconButton
            variant="ghost"
            size="md"
            aria-label="Open navigation menu"
            onClick={onOpenMobile}
            className="lg:hidden text-[#102A2A] hover:bg-[#F3F9F7]"
          >
            <MenuIcon size={20} />
          </IconButton>

          {/* Title or Breadcrumbs */}
          <div className="flex flex-col min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className="flex items-center space-x-1 text-xs text-[#6B7F7F]" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, idx) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  return (
                    <React.Fragment key={crumb.label + idx}>
                      {idx > 0 && <ChevronRightIcon size={12} className="shrink-0 text-[#94A3B8]" />}
                      {crumb.href && !isLast ? (
                        <Link
                          href={crumb.href}
                          className="hover:text-[#102A2A] transition-colors truncate"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className={isLast ? 'font-semibold text-[#102A2A] truncate' : 'truncate'}>
                          {crumb.label}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            ) : title ? (
              <h1 className="text-base md:text-lg font-bold text-[#102A2A] truncate tracking-tight">
                {title}
              </h1>
            ) : null}
          </div>
        </div>

        {/* Right Area: Global Search + Notifications + User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Search Button */}
          <div className="md:hidden">
            <IconButton
              variant="outline"
              size="md"
              aria-label="Open global search"
              onClick={() => setIsSearchOpen(true)}
              className="text-[#6B7F7F] hover:text-[#102A2A]"
            >
              <SearchIcon size={18} />
            </IconButton>
          </div>

          {/* Global Search Field Button (Desktop) */}
          <div className="hidden md:block w-64 lg:w-80">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-[#94A3B8] bg-[#F3F9F7] border border-[#CBD5E1] rounded-lg hover:border-[#064747] hover:bg-white transition-colors cursor-pointer text-left"
              aria-label="Global search across tickets, users, teams, categories, and knowledge base"
            >
              <div className="flex items-center gap-2 min-w-0">
                <SearchIcon size={16} className="text-[#6B7F7F] shrink-0" />
                <span className="truncate">Quick search...</span>
              </div>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#E5EDE9] text-[#475569] shrink-0">
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Notification Bell with interactive preview dropdown */}
          <TopbarNotificationsPopover
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onToggleRead={handleToggleNotificationRead}
          />

          {/* Settings Quick Action (Desktop) */}
          <div className="hidden sm:block">
            <Link href="/settings" tabIndex={-1}>
              <IconButton
                variant="outline"
                size="md"
                aria-label="Settings"
                className="text-[#6B7F7F] hover:text-[#102A2A]"
              >
                <SettingsIcon size={18} />
              </IconButton>
            </Link>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-[#E5EDE9]" />

          {/* User Avatar + Interactive Dropdown Menu */}
          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              aria-label="User account menu"
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#F3F9F7] transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#064747]/20"
            >
              <Avatar
                name={user.name}
                src={user.avatarUrl}
                size="sm"
                className="bg-[#064747] text-white shrink-0"
              />
              <div className="hidden xl:flex flex-col text-left min-w-0">
                <span className="text-xs font-semibold text-[#102A2A] truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[11px] text-[#6B7F7F] capitalize truncate">
                  {user.role}
                </span>
              </div>
            </button>

            {/* Profile Dropdown Popover */}
            {isProfileOpen && (
              <div
                role="menu"
                aria-label="User options"
                className="absolute right-0 top-12 z-50 w-60 bg-white border border-[#E5EDE9] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
              >
                {/* User Header */}
                <div className="p-3.5 border-b border-[#F1F5F4] bg-[#FAFDFC] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102A2A] truncate">
                      {user.name}
                    </span>
                    <Badge variant="default" size="sm" className="capitalize text-[10px]">
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#6B7F7F] truncate">
                    {user.email}
                  </p>
                </div>

                {/* Navigation Links */}
                <div className="p-1.5 space-y-0.5 text-xs text-[#102A2A]">
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F3F9F7] hover:text-[#063F3F] transition-colors cursor-pointer"
                  >
                    <UsersIcon size={15} className="text-[#6B7F7F]" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F3F9F7] hover:text-[#063F3F] transition-colors cursor-pointer"
                  >
                    <SettingsIcon size={15} className="text-[#6B7F7F]" />
                    <span>Settings & Preferences</span>
                  </Link>
                </div>

                {/* Divider & Sign Out */}
                <div className="p-1.5 border-t border-[#F1F5F4] bg-[#FAFDFC]">
                  <Link
                    href="/login"
                    role="menuitem"
                    onClick={async () => {
                      setIsProfileOpen(false);
                      await logout();
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2]/50 transition-colors cursor-pointer"
                  >
                    <LogOutIcon size={15} />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

