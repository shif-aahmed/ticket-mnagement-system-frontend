import { MOCK_TICKETS } from '@/lib/mock-tickets-data';
import { MOCK_USERS } from '@/lib/mock-users-data';
import { MOCK_TEAMS } from '@/lib/mock-teams-data';
import { MOCK_CATEGORIES } from '@/lib/mock-categories-data';
import { MOCK_KNOWLEDGE_ARTICLES } from '@/lib/mock-knowledge-base-data';
import { SearchResultItem, GroupedSearchResults } from '@/types/search';
import { BadgeVariant } from '@/components/ui/badge';

const priorityBadgeMap: Record<string, BadgeVariant> = {
  critical: 'urgent',
  high: 'warning',
  medium: 'active',
  low: 'neutral',
};

const roleBadgeMap: Record<string, BadgeVariant> = {
  administrator: 'default',
  agent: 'active',
  employee: 'neutral',
};

export function performGlobalSearch(query: string): GroupedSearchResults {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      tickets: [],
      users: [],
      teams: [],
      categories: [],
      articles: [],
      totalResults: 0,
    };
  }

  // 1. Search Tickets
  const tickets: SearchResultItem[] = MOCK_TICKETS.filter((t) => {
    return (
      t.id.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      t.requester.name.toLowerCase().includes(q) ||
      t.assignee.name.toLowerCase().includes(q) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.department && t.department.toLowerCase().includes(q))
    );
  })
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      type: 'ticket',
      title: `${t.id}: ${t.subject}`,
      subtitle: `${t.department || 'General'} • Assignee: ${t.assignee.name}`,
      href: `/tickets/${t.id}`,
      badge: t.priority.toUpperCase(),
      badgeVariant: priorityBadgeMap[t.priority] || 'neutral',
      metadata: t.status.replace('_', ' '),
    }));

  // 2. Search Users
  const users: SearchResultItem[] = MOCK_USERS.filter((u) => {
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
    );
  })
    .slice(0, 5)
    .map((u) => ({
      id: u.id,
      type: 'user',
      title: u.name,
      subtitle: `${u.email} • ${u.department}`,
      href: `/users?search=${encodeURIComponent(u.name)}`,
      badge: u.role,
      badgeVariant: roleBadgeMap[u.role] || 'neutral',
      metadata: u.status,
    }));

  // 3. Search Teams
  const teams: SearchResultItem[] = MOCK_TEAMS.filter((tm) => {
    return (
      tm.name.toLowerCase().includes(q) ||
      tm.description.toLowerCase().includes(q) ||
      tm.teamLead.name.toLowerCase().includes(q) ||
      tm.department.toLowerCase().includes(q)
    );
  })
    .slice(0, 5)
    .map((tm) => ({
      id: tm.id,
      type: 'team',
      title: `${tm.name} Team`,
      subtitle: `Lead: ${tm.teamLead.name} • ${tm.department}`,
      href: `/teams?search=${encodeURIComponent(tm.name)}`,
      badge: `${tm.members.length} members`,
      badgeVariant: 'default',
      metadata: tm.department,
    }));

  // 4. Search Categories
  const categories: SearchResultItem[] = MOCK_CATEGORIES.filter((c) => {
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.departmentDefault.toLowerCase().includes(q)
    );
  })
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      type: 'category',
      title: c.name,
      subtitle: c.description,
      href: `/categories?search=${encodeURIComponent(c.name)}`,
      badge: c.status,
      badgeVariant: c.status === 'active' ? 'success' : 'neutral',
      metadata: c.departmentDefault,
    }));

  // 5. Search Knowledge Base Articles
  const articles: SearchResultItem[] = MOCK_KNOWLEDGE_ARTICLES.filter((a) => {
    return (
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.keywords.some((k) => k.toLowerCase().includes(q))
    );
  })
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      type: 'article',
      title: a.title,
      subtitle: a.excerpt,
      href: `/knowledge-base/${a.id}`,
      badge: a.readingTime,
      badgeVariant: 'active',
      metadata: a.category,
    }));

  const totalResults =
    tickets.length + users.length + teams.length + categories.length + articles.length;

  return {
    tickets,
    users,
    teams,
    categories,
    articles,
    totalResults,
  };
}
