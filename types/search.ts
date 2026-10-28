import { BadgeVariant } from '@/components/ui/badge';

export type SearchEntityType = 'ticket' | 'user' | 'team' | 'category' | 'article';

export interface SearchResultItem {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  metadata?: string;
}

export interface GroupedSearchResults {
  tickets: SearchResultItem[];
  users: SearchResultItem[];
  teams: SearchResultItem[];
  categories: SearchResultItem[];
  articles: SearchResultItem[];
  totalResults: number;
}
