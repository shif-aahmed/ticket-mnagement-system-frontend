'use client';

import React from 'react';
import { KnowledgeCategory } from '@/types/knowledge-base';
import { KNOWLEDGE_CATEGORIES } from '@/lib/mock-knowledge-base-data';
import { cn } from '@/lib/utils';

export interface CategoryFilterChipsProps {
  selectedCategory: KnowledgeCategory | 'all';
  onSelectCategory: (category: KnowledgeCategory | 'all') => void;
  categoryCounts: Record<KnowledgeCategory, number>;
  totalCount: number;
  className?: string;
}

export const CategoryFilterChips = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
  className = '',
}: CategoryFilterChipsProps) => {
  return (
    <div
      className={cn('flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none', className)}
      role="tablist"
      aria-label="Filter articles by category"
    >
      {/* "All" chip */}
      <button
        type="button"
        role="tab"
        aria-selected={selectedCategory === 'all'}
        onClick={() => onSelectCategory('all')}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer shrink-0 border',
          selectedCategory === 'all'
            ? 'bg-[#063F3F] text-white border-[#063F3F] shadow-xs'
            : 'bg-white text-[#4B6358] border-[#E5EDE9] hover:bg-[#F3F9F7] hover:text-[#102A2A]'
        )}
      >
        <span>All Categories</span>
        <span
          className={cn(
            'inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full',
            selectedCategory === 'all'
              ? 'bg-white/20 text-white'
              : 'bg-[#EBF5EE] text-[#4B6358]'
          )}
        >
          {totalCount}
        </span>
      </button>

      {/* Categories chips */}
      {KNOWLEDGE_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = categoryCounts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer shrink-0 border',
              isSelected
                ? 'bg-[#063F3F] text-white border-[#063F3F] shadow-xs'
                : 'bg-white text-[#4B6358] border-[#E5EDE9] hover:bg-[#F3F9F7] hover:text-[#102A2A]'
            )}
          >
            <span>{cat.label}</span>
            <span
              className={cn(
                'inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full',
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-[#EBF5EE] text-[#4B6358]'
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
