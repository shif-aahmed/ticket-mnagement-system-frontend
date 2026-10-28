import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusIcon, ArrowUpRightIcon, TicketsIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface EscalationBannerProps {
  title?: string;
  description?: string;
  className?: string;
}

export const EscalationBanner = ({
  title = "Can't find what you're looking for?",
  description = 'Our operations and support teams are available across all departments. Submit a ticket and our specialists will triage and resolve it.',
  className = '',
}: EscalationBannerProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden p-6 md:p-8 bg-gradient-to-r from-[#063F3F] to-[#0B5C5C] text-white rounded-2xl shadow-sm border border-[#064747]',
        className
      )}
    >
      {/* Subtle Background Accent */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-12 top-6 text-white/10 hidden md:block pointer-events-none">
        <TicketsIcon size={120} />
      </div>

      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#86EFAC] border border-white/10">
          <span>Need Personal Assistance?</span>
        </div>

        <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">
          {title}
        </h3>

        <p className="text-xs md:text-sm text-[#DDF4E9]/85 leading-relaxed">
          {description}
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap">
          <Link href="/tickets/create">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<PlusIcon size={16} />}
              className="bg-white text-[#063F3F] hover:bg-[#F3F9F7] font-semibold shadow-sm border-transparent"
            >
              Create a Ticket
            </Button>
          </Link>
          <Link
            href="/tickets"
            className="text-xs text-[#DDF4E9] hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>View your active tickets</span>
            <ArrowUpRightIcon size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
