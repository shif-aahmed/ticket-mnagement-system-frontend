'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { NavSection } from '@/types/navigation';
import { UserProfile } from '@/types/user';
import { NavItem } from '@/components/navigation/nav-item';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  TicketLogoIcon,
  XIcon,
  PanelCollapseIcon,
  PanelExpandIcon,
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  sections: NavSection[];
  user: UserProfile;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar = ({
  sections,
  user,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) => {
  // Dismiss mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    };
    if (isMobileOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#063F3F]/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col bg-[#064747] border-r border-[#0A5555] text-white transition-all duration-200 ease-in-out lg:h-full lg:shrink-0',
          // Desktop sizing
          isCollapsed ? 'lg:w-[68px]' : 'lg:w-64',
          // Mobile drawer positioning
          isMobileOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Sidebar navigation"
      >
        {/* Brand / Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#0A5555] shrink-0">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className={cn(
              'flex items-center gap-3 overflow-hidden outline-none rounded-md focus-visible:ring-2 focus-visible:ring-[#22C55E]/50',
              isCollapsed && 'lg:justify-center lg:w-full'
            )}
          >
            <TicketLogoIcon size={28} className="shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-white">
                    Ticket<span className="text-[#22C55E]">Go</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-[#063F3F] text-[#22C55E] rounded font-semibold border border-[#0A5555]">
                    SaaS
                  </span>
                </div>
                <span className="text-[10px] text-[#A3B8B8] font-medium tracking-wide">
                  Enterprise Desk
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-[#A3B8B8] hover:text-white hover:bg-[#085252] lg:hidden cursor-pointer"
            aria-label="Close navigation menu"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 sidebar-scroll">
          {sections.map((section) => (
            <div key={section.id} className="space-y-1">
              {/* Section Header */}
              {section.title && (!isCollapsed || isMobileOpen) && (
                <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#799494] select-none mb-2">
                  {section.title}
                </h4>
              )}

              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isCollapsed={isCollapsed && !isMobileOpen}
                    onItemClick={onCloseMobile}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: User Profile & Collapse Toggle */}
        <div className="p-3 border-t border-[#0A5555] bg-[#053D3D] shrink-0">
          <div
            className={cn(
              'flex items-center gap-3',
              isCollapsed && !isMobileOpen ? 'justify-center' : 'justify-between'
            )}
          >
            <div
              className={cn(
                'flex items-center gap-3 overflow-hidden',
                isCollapsed && !isMobileOpen && 'justify-center'
              )}
            >
              <Avatar
                name={user.name}
                size="sm"
                status={user.status}
                className="ring-1 ring-[#0A5555]"
              />
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white truncate max-w-[110px]">
                      {user.name}
                    </span>
                    <Badge variant="default" size="sm" className="text-[9px] py-0 px-1 bg-[#064747] text-[#22C55E] border-[#0A5555] uppercase font-mono">
                      {user.role}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-[#A3B8B8] truncate max-w-[135px]">
                    {user.email}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse / Expand Button */}
            {(!isCollapsed || isMobileOpen) && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center h-8 w-8 rounded-md text-[#A3B8B8] hover:text-white hover:bg-[#085252] transition-colors cursor-pointer"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <PanelCollapseIcon size={18} />
              </button>
            )}
          </div>

          {/* Floating Expand Button when collapsed on desktop */}
          {isCollapsed && !isMobileOpen && (
            <div className="mt-2 hidden lg:flex justify-center">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="flex items-center justify-center h-8 w-8 rounded-md text-[#A3B8B8] hover:text-white hover:bg-[#085252] transition-colors cursor-pointer"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <PanelExpandIcon size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
