export type KnowledgeCategory =
  | 'IT & Hardware'
  | 'Software & Applications'
  | 'Network & Connectivity'
  | 'Account & Access'
  | 'Security'
  | 'Engineering & Development'
  | 'HR & Workplace'
  | 'Marketing & Operations';

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: KnowledgeCategory;
  excerpt: string;
  content: string;
  keywords: string[];
  updatedAt: string;
  readingTime: string;
  viewCount: number;
  relatedArticleIds: string[];
}

export type ArticleFeedbackType = 'helpful' | 'not_helpful' | null;

export type KnowledgeSortOption = 'popular' | 'newest' | 'alphabetical';

export interface KnowledgeFilterState {
  search: string;
  category: KnowledgeCategory | 'all';
  sortBy: KnowledgeSortOption;
}
