import React from 'react';
import { DepartmentDistribution } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface DepartmentOverviewProps {
  data: DepartmentDistribution[];
  className?: string;
}

export const DepartmentOverview = ({ data, className = '' }: DepartmentOverviewProps) => {
  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription className="mt-1">
              Active volume across business units ({totalCount.toLocaleString()} total)
            </CardDescription>
          </div>
          <span className="text-xs font-semibold text-[#063F3F] bg-[#DDF4E9] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
            Departments
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.map((item, index) => {
          const deptName = item.department || item.label || (item as any).id || 'Unassigned';
          const itemKey = `${deptName}-${index}`;
          return (
            <div key={itemKey} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', item.colorClass)} aria-hidden="true" />
                  <span className="font-semibold text-[#102A2A]">{deptName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#102A2A]">{item.count.toLocaleString()}</span>
                  <span className="text-[#6B7F7F] text-[11px]">({item.percentage}%)</span>
                </div>
              </div>

              {/* Horizontal progress bar */}
              <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-300', item.colorClass)}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
