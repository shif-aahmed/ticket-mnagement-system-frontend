import React from 'react';
import { KnowledgeArticle } from '@/types/knowledge-base';
import { ArticleCard } from '@/components/knowledge-base/article-card';
import { cn } from '@/lib/utils';

export interface PopularArticlesProps {
  articles: KnowledgeArticle[];
  className?: string;
}

export const PopularArticles = ({ articles, className = '' }: PopularArticlesProps) => {
  if (articles.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base md:text-lg font-bold text-[#102A2A]">
              Popular Solutions
            </h2>
            <span className="text-[11px] font-semibold text-[#063F3F] bg-[#DDF4E9] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
              Top Viewed
            </span>
          </div>
          <p className="text-xs text-[#6B7F7F]">
            Frequently referenced self-service guides and troubleshooting walk-throughs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} featured />
        ))}
      </div>
    </div>
  );
};
