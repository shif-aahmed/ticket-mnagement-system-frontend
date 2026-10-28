import React from 'react';
import Link from 'next/link';
import { KnowledgeArticle } from '@/types/knowledge-base';
import { ClockIcon, EyeIcon, ArrowUpRightIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface ArticleCardProps {
  article: KnowledgeArticle;
  featured?: boolean;
  className?: string;
}

const categoryColorMap: Record<string, { text: string; bg: string; border: string }> = {
  'IT & Hardware': { text: 'text-[#063F3F]', bg: 'bg-[#EBF5EE]', border: 'border-[#D5EADB]' },
  'Software & Applications': { text: 'text-[#0284C7]', bg: 'bg-[#E0F2FE]', border: 'border-[#BAE6FD]' },
  'Network & Connectivity': { text: 'text-[#0D9488]', bg: 'bg-[#CCFBF1]', border: 'border-[#99F6E4]' },
  'Account & Access': { text: 'text-[#D97706]', bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]' },
  'Security': { text: 'text-[#DC2626]', bg: 'bg-[#FEE2E2]', border: 'border-[#FECACA]' },
  'Engineering & Development': { text: 'text-[#7C3AED]', bg: 'bg-[#EDE9FE]', border: 'border-[#DDD6FE]' },
  'HR & Workplace': { text: 'text-[#059669]', bg: 'bg-[#D1FAE5]', border: 'border-[#A7F3D0]' },
  'Marketing & Operations': { text: 'text-[#DB2777]', bg: 'bg-[#FCE7F3]', border: 'border-[#FBCFE8]' },
};

export const ArticleCard = ({ article, featured = false, className = '' }: ArticleCardProps) => {
  const categoryStyle = categoryColorMap[article.category] || {
    text: 'text-[#063F3F]',
    bg: 'bg-[#EBF5EE]',
    border: 'border-[#D5EADB]',
  };

  return (
    <Link
      href={`/knowledge-base/${article.id}`}
      className={cn(
        'group flex flex-col justify-between p-5 bg-white border border-[#E5EDE9] rounded-xl transition-all duration-200 hover:border-[#063F3F]/40 hover:shadow-[0_4px_12px_rgba(6,63,63,0.06)] cursor-pointer',
        featured && 'border-l-4 border-l-[#063F3F]',
        className
      )}
    >
      <div className="space-y-3">
        {/* Category + Meta Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <span
            className={cn(
              'font-semibold px-2.5 py-0.5 rounded-md border text-[11px]',
              categoryStyle.bg,
              categoryStyle.text,
              categoryStyle.border
            )}
          >
            {article.category}
          </span>
          <div className="flex items-center gap-3 text-[11px] text-[#6B7F7F]">
            <span className="inline-flex items-center gap-1">
              <ClockIcon size={12} />
              <span>{article.readingTime}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <EyeIcon size={12} />
              <span>{article.viewCount.toLocaleString()} views</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm md:text-base font-bold text-[#102A2A] leading-snug group-hover:text-[#063F3F] transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-[#6B7F7F] line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
      </div>

      {/* Footer / Read Link */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#F1F5F4] text-xs">
        <span className="text-[11px] text-[#8DA09C]">
          Updated {article.updatedAt}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#063F3F] group-hover:translate-x-0.5 transition-transform">
          <span>Read guide</span>
          <ArrowUpRightIcon size={14} />
        </span>
      </div>
    </Link>
  );
};
