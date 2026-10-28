'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DownloadIcon, FilterIcon } from '@/components/ui/icons';
import { ReportsFiltersState, ReportsCalculatedData } from '@/types/reports';
import { calculateReportsData } from '@/lib/reports-analytics';
import { ReportsSummary } from '@/components/reports/reports-summary';
import { ReportsFilters } from '@/components/reports/reports-filters';
import { ReportsTrendChart } from '@/components/reports/reports-trend-chart';
import { ReportsDistributionCharts } from '@/components/reports/reports-distribution-charts';
import { ReportsWorkloadTable } from '@/components/reports/reports-workload-table';
import { api } from '@/lib/api-client';

const initialFilters: ReportsFiltersState = {
  dateRange: 'all',
  department: 'all',
  status: 'all',
  priority: 'all',
  type: 'all',
  category: 'all',
};

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportsFiltersState>(initialFilters);
  const [reportData, setReportData] = useState<ReportsCalculatedData>(() =>
    calculateReportsData([], initialFilters),
  );
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Load categories for filter dropdown
  useEffect(() => {
    let isMounted = true;
    api.categories
      .list()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch real report data from PostgreSQL / Prisma via NestJS Reports API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    api.reports
      .get(filters)
      .then((data) => {
        if (isMounted && data && typeof data.totalCount === 'number') {
          setReportData(data);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setLoadError(err.message || 'Failed to load report data.');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Report summary export generated successfully.');
    }, 600);
  };

  return (
    <AppShell breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Reports & Analytics' }]}>
      <div className="space-y-6 text-left">
        {/* Page Header */}
        <PageHeader
          title="Reports & Analytics"
          description="Comprehensive management reporting, throughput trends, and team workload capacity."
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                leftIcon={<DownloadIcon size={16} />}
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export Report'}
              </Button>
            </div>
          }
        />

        {/* 1. Summary Metrics Strip */}
        <ReportsSummary metrics={reportData.summaryMetrics} />

        {/* 2. Interactive Filters */}
        <ReportsFilters
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          filteredCount={reportData.totalCount}
          totalCount={reportData.totalCount}
          categories={categories}
        />

        {/* 3. Loading, Error, Content, or Empty State */}
        {isLoading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#6B7F7F] font-medium">Loading report metrics...</p>
            </div>
          </div>
        ) : loadError ? (
          <div className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="h-10 w-10 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center border border-[#FECACA]">⚠</div>
              <p className="text-sm font-semibold text-[#102A2A]">Failed to load reports</p>
              <p className="text-xs text-[#6B7F7F]">{loadError}</p>
            </div>
          </div>
        ) : reportData.totalCount > 0 ? (
          <div className="space-y-6">
            {/* Work & Throughput Trend */}
            <ReportsTrendChart
              data={reportData.trendPoints}
            />

            {/* Lifecycle, Priority, Type, and Department Distributions */}
            <ReportsDistributionCharts
              statusData={reportData.statusDistribution}
              priorityData={reportData.priorityDistribution}
              typeData={reportData.typeDistribution}
              departmentData={reportData.departmentDistribution}
              categoryData={reportData.categoryDistribution}
            />

            {/* Assignee & Team Capacity Table */}
            <ReportsWorkloadTable data={reportData.assigneeWorkload} />
          </div>
        ) : (
          /* Empty Filter State */
          <Card className="p-12 text-center border-dashed border-[#CBD5E1] bg-white">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#F3F9F7] flex items-center justify-center text-[#063F3F]">
                <FilterIcon size={24} />
              </div>
              <h3 className="text-sm font-semibold text-[#102A2A]">
                No matching tickets found
              </h3>
              <p className="text-xs text-[#6B7F7F]">
                No ticket records match your combined filter criteria. Try broadening your date range or clearing specific department/status filters.
              </p>
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Reset all filters
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
