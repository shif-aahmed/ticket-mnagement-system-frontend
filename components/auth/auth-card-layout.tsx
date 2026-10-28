import React from 'react';
import Link from 'next/link';
import { TicketsIcon } from '@/components/ui/icons';

export interface AuthCardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthCardLayout = ({
  children,
  title,
  subtitle,
}: AuthCardLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#F3F9F7] flex flex-col items-center justify-center p-4 sm:p-6 text-left">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-[#064747] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <TicketsIcon size={22} />
          </div>
          <span className="text-xl font-black tracking-tight text-[#102A2A]">
            Ticket<span className="text-[#0F766E]">Go</span>
          </span>
        </Link>
        <p className="text-xs text-[#6B7F7F] font-medium tracking-wide">
          Unified Enterprise Support & Work Management
        </p>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5EDE9] shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[#102A2A] tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-[#6B7F7F] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {children}
      </div>

      {/* Security Footer */}
      <div className="mt-8 text-center text-[11px] text-[#6B7F7F] space-y-1">
        <p>Enterprise Single Sign-On (SSO) & Multi-Factor Auth Supported</p>
        <p className="text-[#94A3B8]">
          TicketGo Internal Preview System • Frontend Only Session
        </p>
      </div>
    </div>
  );
};
