'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { PlusIcon, XIcon, SearchIcon } from '@/components/ui/icons';
import { CategoryFilterChips } from '@/components/knowledge-base/category-filter-chips';
import { PopularArticles } from '@/components/knowledge-base/popular-articles';
import { ArticleCard } from '@/components/knowledge-base/article-card';
import { EscalationBanner } from '@/components/knowledge-base/escalation-banner';
import {
  KnowledgeArticle,
  KnowledgeCategory,
  KnowledgeSortOption,
} from '@/types/knowledge-base';
import { api } from '@/lib/api-client';

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<KnowledgeSortOption>('popular');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadArticles() {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await api.knowledgeBase.list({ limit: 50 });
        const raw = Array.isArray(res) ? res : res?.articles || res?.items || null;
        if (mounted && Array.isArray(raw)) {
          const mapped: KnowledgeArticle[] = raw.map((a: any) => ({
            id: a.id,
            title: a.title,
            category: a.category as KnowledgeCategory,
            excerpt: a.excerpt || '',
            content: a.content || '',
            readingTime: a.readingTime || '3 min read',
            viewCount: a.viewCount || 0,
            updatedAt: a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : 'Recently',
            keywords: a.tags || a.keywords || [],
            relatedArticleIds: a.relatedArticleIds || [],
          }));
          setArticles(mapped);
        }
      } catch (err: any) {
        if (mounted) {
          setLoadError(err.message || 'Failed to load knowledge articles.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadArticles();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<KnowledgeCategory, number> = {
      'IT & Hardware': 0,
      'Software & Applications': 0,
      'Network & Connectivity': 0,
      'Account & Access': 0,
      'Security': 0,
      'Engineering & Development': 0,
      'HR & Workplace': 0,
      'Marketing & Operations': 0,
    };
    articles.forEach((article) => {
      if (counts[article.category] !== undefined) {
        counts[article.category]++;
      }
    });
    return counts;
  }, [articles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = articles.filter((article) => {
      // 1. Category match
      if (selectedCategory !== 'all' && article.category !== selectedCategory) {
        return false;
      }

      // 2. Search match (title, category, excerpt, keywords)
      if (q) {
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesCategory = article.category.toLowerCase().includes(q);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(q);
        const matchesKeyword = (article.keywords || []).some((kw) => kw.toLowerCase().includes(q));

        if (!matchesTitle && !matchesCategory && !matchesExcerpt && !matchesKeyword) {
          return false;
        }
      }

      return true;
    });

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'popular') {
        return b.viewCount - a.viewCount;
      }
      if (sortBy === 'newest') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [articles, search, selectedCategory, sortBy]);

  // Most popular articles for featured strip
  const popularArticles = useMemo(() => {
    return [...articles].sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
  }, [articles]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
  };

  const isFiltered = search.trim() !== '' || selectedCategory !== 'all';

  return (
    <AppShell breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Knowledge Base' }]}>
      <div className="space-y-6 text-left">
        {/* Page Header */}
        <PageHeader
          title="Knowledge Base & Documentation"
          description="Self-service guides, troubleshooting documentation, IT service procedures, and architectural overviews."
          actions={
            <Link href="/tickets/create">
              <Button variant="primary" size="md" leftIcon={<PlusIcon size={16} />}>
                Submit a Ticket
              </Button>
            </Link>
          }
        />

        {/* 1. Global Search Strip */}
        <div className="bg-gradient-to-r from-[#063F3F] via-[#094E4E] to-[#0A5A5A] rounded-2xl p-6 sm:p-8 text-white space-y-4 shadow-sm">
          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              How can we assist you today?
            </h2>
            <p className="text-xs sm:text-sm text-[#A3CBCB] leading-relaxed">
              Search answers, technical specifications, resolution runbooks, and department workflows.
            </p>
          </div>

          <div className="max-w-2xl">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder="Search by topic, keyword, application, or error message (e.g., VPN, MFA, Figma)..."
              className="bg-white text-[#102A2A] shadow-md border-0 focus:ring-2 focus:ring-[#52D1B2]"
            />
          </div>

          {/* Quick Search Tag Suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-[#A3CBCB]">
            <span className="font-semibold text-white">Popular topics:</span>
            {['VPN Access', 'Okta MFA Reset', 'Figma License', 'Deploy Key', 'SCIM Sync'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearch(tag)}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Category Filter Chips Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7F7F]">
              Browse by Knowledge Category
            </h3>
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<XIcon size={14} />}
                onClick={handleClearFilters}
                className="text-xs text-[#DC2626] hover:bg-[#FEE2E2]/60 h-7 px-2"
              >
                Clear all filters
              </Button>
            )}
          </div>

          <CategoryFilterChips
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
            totalCount={articles.length}
          />
        </div>

        {/* 3. Loading / Error States */}
        {loading && articles.length === 0 ? (
          <div className="py-16 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#6B7F7F] font-medium">Loading articles...</p>
            </div>
          </div>
        ) : loadError ? (
          <div className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="h-10 w-10 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center border border-[#FECACA]">⚠</div>
              <p className="text-sm font-semibold text-[#102A2A]">Failed to load knowledge base</p>
              <p className="text-xs text-[#6B7F7F]">{loadError}</p>
            </div>
          </div>
        ) : (
          <>
            {/* 4. Popular Articles Section (Only shown when not actively filtering) */}
            {!isFiltered && (
              <PopularArticles articles={popularArticles} />
            )}

            {/* 5. All Articles / Search Results Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E5EDE9]">
                <div className="space-y-0.5">
                  <h2 className="text-base md:text-lg font-bold text-[#102A2A]">
                    {isFiltered ? 'Search & Filter Results' : 'All Knowledge Articles'}
                  </h2>
                  <p className="text-xs text-[#6B7F7F]">
                    Showing <strong className="text-[#102A2A]">{filteredArticles.length}</strong> of{' '}
                    {articles.length} published guides
                    {selectedCategory !== 'all' && (
                      <span> in <strong className="text-[#063F3F]">{selectedCategory}</strong></span>
                    )}
                    {search.trim() && (
                      <span> matching &ldquo;<strong className="text-[#063F3F]">{search}</strong>&rdquo;</span>
                    )}
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B7F7F] whitespace-nowrap">Sort by:</span>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as KnowledgeSortOption)}
                    containerClassName="w-auto"
                    className="text-xs font-medium"
                    aria-label="Sort articles"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Recently Updated</option>
                    <option value="alphabetical">Alphabetical (A–Z)</option>
                  </Select>
                </div>
              </div>

              {/* Results Grid or Empty State */}
              {filteredArticles.length === 0 ? (
                <div className="py-12 px-6 bg-white border border-[#E5EDE9] rounded-2xl text-center space-y-4 max-w-lg mx-auto">
                  <div className="h-12 w-12 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto border border-[#FDE68A]">
                    <SearchIcon size={22} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#102A2A]">No articles found</h3>
                    <p className="text-xs text-[#6B7F7F]">
                      We couldn&apos;t find any articles matching &ldquo;{search}&rdquo; in {selectedCategory === 'all' ? 'the knowledge base' : selectedCategory}.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<XIcon size={14} />}
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </Button>
                    <Link href="/tickets/create">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<PlusIcon size={14} />}
                      >
                        Create a Ticket
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>

            {/* 6. Self-Service Escalation Banner */}
            <EscalationBanner />
          </>
        )}
      </div>
    </AppShell>
  );
}
