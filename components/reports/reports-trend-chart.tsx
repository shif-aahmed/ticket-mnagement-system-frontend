'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ReportsTrendPoint } from '@/types/reports';

export interface ReportsTrendChartProps {
  data: ReportsTrendPoint[];
}

export const ReportsTrendChart = ({ data }: ReportsTrendChartProps) => {
  const maxVal = Math.max(
    ...data.flatMap((d) => [d.created, d.resolved]),
    5
  );

  const totalCreated = data.reduce((acc, curr) => acc + curr.created, 0);
  const totalResolved = data.reduce((acc, curr) => acc + curr.resolved, 0);
  const netChange = totalCreated - totalResolved;

  return (
    <Card className="flex flex-col border-[#E5EDE9] text-left">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Work & Throughput Trend</CardTitle>
            <CardDescription className="mt-0.5">
              Intake volume versus resolutions across 6 reporting intervals
            </CardDescription>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#064747]" />
              <span className="text-[#102A2A] font-medium">Created ({totalCreated})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#10B981]" />
              <span className="text-[#102A2A] font-medium">Resolved ({totalResolved})</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trend Bar Chart Visualization */}
        <div className="pt-4 pb-2">
          <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 border-b border-[#E5EDE9] px-2 sm:px-4">
            {data.map((point) => {
              const createdHeight = Math.round((point.created / maxVal) * 100);
              const resolvedHeight = Math.round((point.resolved / maxVal) * 100);

              return (
                <div
                  key={point.label}
                  className="flex-1 flex flex-col items-center h-full justify-end group"
                >
                  {/* Tooltip Hover Display */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-center font-mono mb-1 text-[#6B7F7F]">
                    +{point.created} / -{point.resolved}
                  </div>

                  {/* Dual Bar Column */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-36">
                    {/* Created Bar */}
                    <div
                      style={{ height: `${Math.max(8, createdHeight)}%` }}
                      className="w-1/2 max-w-[24px] bg-[#064747] rounded-t hover:bg-[#0F766E] transition-all"
                      title={`${point.label} Created: ${point.created}`}
                    />
                    {/* Resolved Bar */}
                    <div
                      style={{ height: `${Math.max(8, resolvedHeight)}%` }}
                      className="w-1/2 max-w-[24px] bg-[#10B981] rounded-t hover:bg-[#34D399] transition-all"
                      title={`${point.label} Resolved: ${point.resolved}`}
                    />
                  </div>

                  {/* Period Label */}
                  <span className="text-[11px] font-medium text-[#6B7F7F] mt-2 group-hover:text-[#102A2A] transition-colors">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Throughput Summary Footer */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F1F5F4] text-center">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
              Total Intake
            </span>
            <p className="text-sm font-bold text-[#064747]">
              {totalCreated} tickets
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
              Total Resolved
            </span>
            <p className="text-sm font-bold text-[#10B981]">
              {totalResolved} tickets
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-[#6B7F7F]">
              Net Backlog Delta
            </span>
            <p
              className={`text-sm font-bold ${
                netChange > 0 ? 'text-[#D97706]' : 'text-[#15803D]'
              }`}
            >
              {netChange > 0 ? `+${netChange} backlog` : `${netChange} backlog`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
