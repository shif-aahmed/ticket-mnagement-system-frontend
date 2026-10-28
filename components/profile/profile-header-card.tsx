'use client';

import React from 'react';
import { UserProfile } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircleIcon } from '@/components/ui/icons';

export interface ProfileHeaderCardProps {
  user: UserProfile;
}

export const ProfileHeaderCard = ({ user }: ProfileHeaderCardProps) => {
  return (
    <Card className="p-6 border-[#E5EDE9] bg-white text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Avatar + Main Info */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <Avatar
              name={user.name}
              src={user.avatarUrl}
              size="lg"
              className="h-16 w-16 text-lg bg-[#064747] text-white shadow-md"
            />
            <span
              className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-[#22C55E]"
              title="Status: Online"
            />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-bold text-[#102A2A] truncate">
                {user.name}
              </h2>
              <Badge variant="default" size="sm" className="capitalize">
                {user.role}
              </Badge>
              <Badge variant="success" dot size="sm">
                Active Account
              </Badge>
            </div>

            <p className="text-xs font-medium text-[#475569]">
              {user.title || 'Principal Systems Administrator'}
            </p>

            <div className="flex items-center gap-3 text-xs text-[#6B7F7F] flex-wrap pt-0.5">
              <span>{user.email}</span>
              <span>•</span>
              <span>{user.department || 'Engineering'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#059669]">
                <CheckCircleIcon size={13} />
                <span>Verified Enterprise Identity</span>
              </span>
            </div>
          </div>
        </div>

        {/* Account Identifier Badge */}
        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F1F5F4] text-xs text-[#6B7F7F]">
          <span className="text-[11px] uppercase tracking-wider font-semibold">
            Account ID
          </span>
          <span className="font-mono text-xs text-[#102A2A] font-medium mt-0.5">
            {user.id}
          </span>
        </div>
      </div>
    </Card>
  );
};
