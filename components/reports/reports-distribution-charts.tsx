'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReportsDistributionItem } from '@/types/reports';

export interface ReportsDistributionChartsProps {
  statusData: ReportsDistributionItem[];
  priorityData: ReportsDistributionItem[];
  typeData: ReportsDistributionItem[];
  departmentData: ReportsDistributionItem[];
  categoryData: ReportsDistributionItem[];
}

export const ReportsDistributionCharts = ({
  statusData,
  priorityData,
  typeData,
  departmentData,
  categoryData,
}: ReportsDistributionChartsProps) => {
  return (
    <div className="space-y-6 text-left">
      {/* 1. Status & Priority Distribution (2 Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Lifecycle Overview */}
        <Card className="flex flex-col border-[#E5EDE9]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Status & Lifecycle Distribution</CardTitle>
                <CardDescription className="mt-0.5">
                  Breakdown across active intake, triage, and resolution
                </CardDescription>
              </div>
              <Badge variant="default" size="sm">
                Lifecycle
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Proportional Multi-Segment Progress Bar */}
            <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden flex gap-0.5 p-0.5">
              {statusData.map((item) => (
                <div
                  key={item.id}
                  style={{ width: `${item.percentage}%` }}
                  className={`h-full rounded-sm transition-all duration-300 ${item.colorClass}`}
                  title={`${item.label}: ${item.count} (${item.percentage}%)`}
                />
              ))}
            </div>

            {/* Detailed Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {statusData.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg border border-[#E5EDE9] bg-[#FAFDFC] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#102A2A]">
                      {item.label}
                    </span>
                    <Badge variant={item.badgeVariant || 'neutral'} size="sm">
                      {item.percentage}%
                    </Badge>
                  </div>
                  <p className="text-base font-bold text-[#102A2A]">
                    {item.count}{' '}
                    <span className="text-[10px] font-normal text-[#6B7F7F]">tickets</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Urgency Distribution */}
        <Card className="flex flex-col border-[#E5EDE9]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Priority & Urgency Breakdown</CardTitle>
                <CardDescription className="mt-0.5">
                  Severity distribution across active queue
                </CardDescription>
              </div>
              <Badge variant="warning" size="sm">
                Urgency
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5">
            {priorityData.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.badgeVariant || 'neutral'} dot size="sm">
                      {item.label}
                    </Badge>
                    <span className="text-[11px] text-[#6B7F7F]">
                      {item.percentage}% of tickets
                    </span>
                  </div>
                  <span className="font-semibold text-[#102A2A]">
                    {item.count} tickets
                  </span>
                </div>

                <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(4, item.percentage)}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${item.colorClass}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 2. Work Types & Department Distribution (2 Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Type Distribution */}
        <Card className="flex flex-col border-[#E5EDE9]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ticket Type Classification</CardTitle>
                <CardDescription className="mt-0.5">
                  Tasks, support requests, incidents, bugs, and general work
                </CardDescription>
              </div>
              <Badge variant="active" size="sm">
                Workload
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5">
            {typeData.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.badgeVariant || 'neutral'} size="sm">
                      {item.label}
                    </Badge>
                    <span className="text-[11px] text-[#6B7F7F]">
                      {item.percentage}%
                    </span>
                  </div>
                  <span className="font-semibold text-[#102A2A]">
                    {item.count} tickets
                  </span>
                </div>

                <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(4, item.percentage)}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${item.colorClass}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="flex flex-col border-[#E5EDE9]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Department & Team Distribution</CardTitle>
                <CardDescription className="mt-0.5">
                  Volume distribution and resolution breakdown by team
                </CardDescription>
              </div>
              <Badge variant="default" size="sm">
                Teams
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5">
            {departmentData.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#102A2A]">{item.label}</span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-[#10B981] font-medium">
                      {item.secondaryCount || 0} resolved
                    </span>
                    <span className="text-[#6B7F7F]">•</span>
                    <span className="font-semibold text-[#102A2A]">
                      {item.count} total ({item.percentage}%)
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(4, item.percentage)}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${item.colorClass}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 3. Category Distribution (Full Width Grid) */}
      <Card className="flex flex-col border-[#E5EDE9]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Category Taxonomies</CardTitle>
              <CardDescription className="mt-0.5">
                Distribution across primary organizational ticket categories
              </CardDescription>
            </div>
            <Badge variant="neutral" size="sm">
              Taxonomy
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categoryData.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-[#E5EDE9] bg-[#FAFDFC] space-y-1.5"
              >
                <span className="text-xs font-semibold text-[#102A2A] line-clamp-1">
                  {item.label}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-[#063F3F]">
                    {item.count}
                  </span>
                  <span className="text-[11px] text-[#6B7F7F]">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#E5EDE9] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(5, item.percentage)}%` }}
                    className="h-full bg-[#064747] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
