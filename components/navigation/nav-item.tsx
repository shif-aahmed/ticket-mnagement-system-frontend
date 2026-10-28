'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem as NavItemType } from '@/types/navigation';
import { NavIcon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface NavItemProps {
  item: NavItemType;
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

export const NavItem = ({ item, isCollapsed = false, onItemClick }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onItemClick}
      title={isCollapsed ? item.label : undefined}
      className={cn(
        'group relative flex items-center rounded-lg text-sm font-medium transition-colors outline-none select-none',
        isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'h-10 px-3 gap-3 w-full',
        isActive
          ? 'bg-[#0B5C5C] text-white shadow-xs'
          : 'text-[#A3B8B8] hover:bg-[#085252] hover:text-white',
        'focus-visible:ring-2 focus-visible:ring-[#22C55E]/50'
      )}
    >
      {/* Active accent pill indicator */}
      {isActive && (
        <span
          className={cn(
            'absolute bg-[#22C55E] rounded-r',
            isCollapsed
              ? 'left-0 top-2 bottom-2 w-1'
              : 'left-0 top-1.5 bottom-1.5 w-1 rounded-r-md'
          )}
        />
      )}

      {/* Icon */}
      <span
        className={cn(
          'shrink-0 transition-transform group-hover:scale-105',
          isActive ? 'text-[#22C55E]' : 'text-[#A3B8B8] group-hover:text-white'
        )}
      >
        <NavIcon name={item.icon} size={18} />
      </span>

      {/* Label and Badge (when not collapsed) */}
      {!isCollapsed && (
        <div className="flex flex-1 items-center justify-between overflow-hidden">
          <span className="truncate text-xs md:text-sm">{item.label}</span>
          {item.badge !== undefined && (
            <Badge
              variant={item.badgeVariant || 'default'}
              size="sm"
              className="ml-auto"
            >
              {item.badge}
            </Badge>
          )}
        </div>
      )}

      {/* Collapsed Badge Dot */}
      {isCollapsed && item.badge !== undefined && (
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#22C55E] ring-2 ring-[#064747]" />
      )}
    </Link>
  );
};
