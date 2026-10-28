import React from 'react';
import Link from 'next/link';
import { BreadcrumbItem } from '@/types/navigation';
import { ChevronRightIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  breadcrumbs,
  actions,
  className = '',
}: PageHeaderProps) => {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-center md:justify-between pb-6 mb-6 border-b border-[#E5EDE9]', className)}>
      <div className="space-y-1">
        {/* Optional Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 text-xs text-[#6B7F7F] mb-1.5" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.label + idx}>
                  {idx > 0 && <ChevronRightIcon size={12} className="shrink-0 text-[#94A3B8]" />}
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-[#102A2A] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'font-medium text-[#102A2A]' : ''}>
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Page Title */}
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#102A2A]">
          {title}
        </h1>

        {/* Page Description */}
        {description && (
          <p className="text-xs md:text-sm text-[#6B7F7F]">
            {description}
          </p>
        )}
      </div>

      {/* Action Buttons Slot */}
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 pt-1 md:pt-0">
          {actions}
        </div>
      )}
    </div>
  );
};
