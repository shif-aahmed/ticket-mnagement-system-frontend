'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { XIcon, SearchIcon, ArrowUpRightIcon } from '@/components/ui/icons';
import { TeamSummary } from '@/components/teams/team-summary';
import { TeamFilters } from '@/components/teams/team-filters';
import { TeamCard } from '@/components/teams/team-card';
import { TeamDetailsModal } from '@/components/teams/team-details-modal';
import { Team, TeamFiltersState, TeamSummaryMetric } from '@/types/team';
import { Ticket } from '@/types/ticket';
import { getTeamStats, getTeamTickets } from '@/lib/mock-teams-data';
import { api } from '@/lib/api-client';

const initialFilters: TeamFiltersState = {
  search: '',
  workload: 'all',
};

const COLOR_PALETTE = [
  { colorClass: 'text-[#063F3F]', bgClass: 'bg-[#EBF5EE]' },
  { colorClass: 'text-[#7C3AED]', bgClass: 'bg-[#EDE9FE]' },
  { colorClass: 'text-[#0284C7]', bgClass: 'bg-[#E0F2FE]' },
  { colorClass: 'text-[#D97706]', bgClass: 'bg-[#FEF3C7]' },
  { colorClass: 'text-[#DC2626]', bgClass: 'bg-[#FEE2E2]' },
];

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filters, setFilters] = useState<TeamFiltersState>(initialFilters);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [teamsRes, ticketsRes] = await Promise.allSettled([
          api.teams.list(),
          api.tickets.list({ limit: 100 }),
        ]);

        if (!mounted) return;

        if (teamsRes.status === 'fulfilled' && Array.isArray(teamsRes.value) && teamsRes.value.length > 0) {
          const mapped: Team[] = teamsRes.value.map((t: any, index: number) => {
            const style = COLOR_PALETTE[index % COLOR_PALETTE.length];
            return {
              id: t.id,
              name: t.name,
              department: t.department || 'General',
              description: t.description || '',
              teamLead: t.teamLead
                ? {
                    id: t.teamLead.id,
                    name: t.teamLead.name,
                    email: t.teamLead.email,
                    role: t.teamLead.role,
                    avatarUrl: t.teamLead.avatarUrl,
                  }
                : { id: 'lead', name: 'Unassigned', email: '', role: 'Lead' },
              members: (t.members || []).map((m: any) => ({
                id: m.user?.id || m.id,
                name: m.user?.name || m.name,
                email: m.user?.email || m.email,
                role: m.role || m.user?.role || 'Member',
                avatarUrl: m.user?.avatarUrl,
              })),
              colorClass: style.colorClass,
              bgClass: style.bgClass,
            };
          });
          setTeams(mapped);
        }

        if (ticketsRes.status === 'fulfilled' && ticketsRes.value) {
          const raw = ticketsRes.value.items || ticketsRes.value.tickets || (Array.isArray(ticketsRes.value) ? ticketsRes.value : null);
          if (Array.isArray(raw) && raw.length > 0) {
            const mappedTickets: Ticket[] = raw.map((t: any) => ({
              id: t.key || t.id,
              subject: t.subject,
              description: t.description,
              type: t.type,
              department: t.department || 'Engineering',
              project: t.project,
              dueDate: t.dueDate,
              category: t.category?.name || t.categoryId,
              priority: t.priority,
              status: t.status,
              createdAt: t.createdAt,
              updatedAt: t.updatedAt,
              requester: {
                name: t.requester?.name || 'Requester',
                email: t.requester?.email || '',
                avatarUrl: t.requester?.avatarUrl,
              },
              assignee: {
                name: t.assignee?.name || 'Unassigned',
                email: t.assignee?.email || '',
                avatarUrl: t.assignee?.avatarUrl,
              },
            }));
            setTickets(mappedTickets);
          }
        }
      } catch (err: any) {
        if (mounted) setLoadError(err.message || 'Failed to load teams.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute calculated stats for all teams from unified tickets
  const teamStatsMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getTeamStats>>();
    teams.forEach((team) => {
      map.set(team.id, getTeamStats(team, tickets));
    });
    return map;
  }, [teams, tickets]);

  // Overall summary metrics
  const summaryMetrics = useMemo<TeamSummaryMetric[]>(() => {
    let totalMembers = 0;
    let totalActive = 0;
    let totalOverdue = 0;

    teamStatsMap.forEach((stats) => {
      totalMembers += stats.memberCount;
      totalActive += stats.activeTickets;
      totalOverdue += stats.overdueTickets;
    });

    return [
      {
        id: 'teams',
        label: 'Total Teams',
        value: teams.length,
        changeText: 'Across organization',
        variant: 'default',
      },
      {
        id: 'members',
        label: 'Team Members',
        value: totalMembers,
        changeText: 'Cross-functional',
        variant: 'active',
      },
      {
        id: 'active',
        label: 'Active Workload',
        value: totalActive,
        changeText: 'Tickets in flight',
        variant: 'warning',
      },
      {
        id: 'overdue',
        label: 'Overdue Items',
        value: totalOverdue,
        changeText: 'Requires lead triage',
        variant: totalOverdue > 0 ? 'urgent' : 'success',
      },
    ];
  }, [teams, teamStatsMap]);

  // Client-side filtering
  const filteredTeams = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return teams.filter((team) => {
      const stats = teamStatsMap.get(team.id);

      // Search match: name, department, lead name, description, or members
      if (q) {
        const matchesName = team.name.toLowerCase().includes(q);
        const matchesDept = team.department.toLowerCase().includes(q);
        const matchesLead = team.teamLead.name.toLowerCase().includes(q);
        const matchesDesc = team.description.toLowerCase().includes(q);
        const matchesMember = team.members.some((m) => m.name.toLowerCase().includes(q));

        if (!matchesName && !matchesDept && !matchesLead && !matchesDesc && !matchesMember) {
          return false;
        }
      }

      // Workload status match
      if (filters.workload !== 'all' && stats && stats.workloadStatus !== filters.workload) {
        return false;
      }

      return true;
    });
  }, [teams, filters, teamStatsMap]);

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const selectedTeamTickets = useMemo(() => {
    if (!viewingTeam) return [];
    return getTeamTickets(viewingTeam, tickets);
  }, [viewingTeam, tickets]);

  const selectedTeamStats = useMemo(() => {
    if (!viewingTeam) return null;
    return teamStatsMap.get(viewingTeam.id) || null;
  }, [viewingTeam, teamStatsMap]);

  return (
    <AppShell
      title="Teams"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Teams' },
      ]}
    >
      {/* 1. Page Header */}
      <PageHeader
        title="Teams"
        description="Monitor cross-functional team structure, leads, member allocation, and real-time workload queues."
        actions={
          <Link href="/tickets">
            <Button
              variant="secondary"
              size="md"
              rightIcon={<ArrowUpRightIcon size={14} />}
            >
              View All Tickets
            </Button>
          </Link>
        }
      />

      <div className="space-y-6">
        {/* 2. Summary Metrics */}
        <TeamSummary metrics={summaryMetrics} />

        {/* 3. Filters & Search */}
        <TeamFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
          resultCount={filteredTeams.length}
          totalCount={teams.length}
        />

        {/* 4. Teams Grid or Empty State */}
        {filteredTeams.length === 0 ? (
          <div className="py-12 px-6 bg-white border border-[#E5EDE9] rounded-2xl text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="h-12 w-12 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto border border-[#FDE68A]">
              <SearchIcon size={22} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#102A2A]">No teams found</h3>
              <p className="text-xs text-[#6B7F7F]">
                No teams matched your current search &ldquo;{filters.search}&rdquo; or filter criteria.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<XIcon size={14} />}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team) => {
              const stats = teamStatsMap.get(team.id)!;
              return (
                <TeamCard
                  key={team.id}
                  team={team}
                  stats={stats}
                  onOpenDetails={(t) => setViewingTeam(t)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Team Details Modal */}
      <TeamDetailsModal
        team={viewingTeam}
        stats={selectedTeamStats}
        tickets={selectedTeamTickets}
        isOpen={Boolean(viewingTeam)}
        onClose={() => setViewingTeam(null)}
      />
    </AppShell>
  );
}
