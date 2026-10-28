'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeftIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
} from '@/components/ui/icons';
import { ArticleFeedback } from '@/components/knowledge-base/article-feedback';
import { KnowledgeArticle } from '@/types/knowledge-base';
import { api } from '@/lib/api-client';

export default function KnowledgeArticlePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const decodedId = decodeURIComponent(id);

  const [article, setArticle] = useState<KnowledgeArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<KnowledgeArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setLoadError(null);

    api.knowledgeBase
      .get(decodedId)
      .then((data: any) => {
        if (!mounted) return;
        if (data) {
          setArticle({
            id: data.id,
            title: data.title,
            category: data.category,
            excerpt: data.excerpt || '',
            content: data.content || '',
            readingTime: data.readingTime || '3 min read',
            viewCount: data.viewCount || 0,
            updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'Recently',
            keywords: data.tags || data.keywords || [],
            relatedArticleIds: data.relatedArticleIds || [],
          });
          if (Array.isArray(data.relatedArticles)) {
            setRelatedArticles(data.relatedArticles.map((r: any) => ({
              id: r.id,
              title: r.title,
              category: r.category,
              excerpt: r.excerpt || '',
              content: '',
              readingTime: r.readingTime || '3 min read',
              viewCount: r.viewCount || 0,
              updatedAt: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Recently',
              keywords: [],
              relatedArticleIds: [],
            })));
          }
        }
      })
      .catch((err: any) => {
        if (mounted) setLoadError(err.message || 'Failed to load article.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, [decodedId]);

  // Loading state
  if (isLoading) {
    return (
      <AppShell title="Loading..." breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Knowledge Base', href: '/knowledge-base' }, { label: '...' }]}>
        <div className="py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#6B7F7F] font-medium">Loading article...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  // Not found / error state
  if (loadError || !article) {
    return (
      <AppShell
        title="Article Not Found"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Knowledge Base', href: '/knowledge-base' },
          { label: 'Not Found' },
        ]}
      >
        <PageHeader
          title="Article Not Found"
          description="The requested knowledge base article could not be located."
          breadcrumbs={[
            { label: 'Knowledge Base', href: '/knowledge-base' },
            { label: 'Not Found' },
          ]}
        />

        <Card className="max-w-xl mx-auto text-center py-12 px-6 space-y-4">
          <div className="h-12 w-12 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center mx-auto border border-[#FECACA]">
            <BookOpenIcon size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#102A2A]">
              {loadError ? 'Failed to load article' : 'Article not found'}
            </h3>
            <p className="text-xs md:text-sm text-[#6B7F7F] max-w-md mx-auto">
              {loadError || `We couldn\u0027t find an article matching identifier \u201c${decodedId}\u201d. It may have been archived, moved, or the link may be mistyped.`}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link href="/knowledge-base">
              <Button variant="primary" size="md" leftIcon={<ChevronLeftIcon size={16} />}>
                Back to Knowledge Base
              </Button>
            </Link>
            <Link href="/tickets/create">
              <Button variant="secondary" size="md" leftIcon={<PlusIcon size={16} />}>
                Create a Ticket
              </Button>
            </Link>
          </div>
        </Card>
      </AppShell>
    );
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

  const categoryStyle = categoryColorMap[article.category] || {
    text: 'text-[#063F3F]',
    bg: 'bg-[#EBF5EE]',
    border: 'border-[#D5EADB]',
  };

  // Related articles are now loaded from API above

  return (
    <AppShell
      title={article.title}
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Knowledge Base', href: '/knowledge-base' },
        { label: article.title },
      ]}
    >
      {/* Page Header */}
      <PageHeader
        title={article.title}
        description={`Category: ${article.category} • Updated ${article.updatedAt} • ${article.readingTime}`}
        breadcrumbs={[
          { label: 'Knowledge Base', href: '/knowledge-base' },
          { label: article.title },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/knowledge-base">
              <Button variant="secondary" size="md" leftIcon={<ChevronLeftIcon size={16} />}>
                Back to Guides
              </Button>
            </Link>
            <Link href="/tickets/create">
              <Button variant="primary" size="md" leftIcon={<PlusIcon size={16} />}>
                Create a Ticket
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Article Content Column */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 md:p-8 space-y-6">
            {/* Article Top Meta Badge */}
            <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#E5EDE9] pb-4">
              <span
                className={`font-semibold px-3 py-1 rounded-md border text-xs ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
              >
                {article.category}
              </span>

              <div className="flex items-center gap-4 text-xs text-[#6B7F7F]">
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon size={14} />
                  <span>{article.readingTime}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <EyeIcon size={14} />
                  <span>{article.viewCount.toLocaleString()} views</span>
                </span>
              </div>
            </div>

            {/* Excerpt Summary Box */}
            <div className="p-4 rounded-xl bg-[#F3F9F7] border border-[#D5EADB] text-xs md:text-sm text-[#063F3F] leading-relaxed">
              <strong className="font-semibold block mb-1">Guide Summary</strong>
              {article.excerpt}
            </div>

            {/* Article Body Content */}
            <div className="prose prose-slate max-w-none text-xs md:text-sm text-[#102A2A] leading-relaxed space-y-4">
              {article.content.split('\n\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();

                // Headings
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2
                      key={index}
                      className="text-base md:text-lg font-bold text-[#102A2A] pt-4 border-t border-[#F1F5F4] first:border-0 first:pt-0"
                    >
                      {trimmed.replace('## ', '')}
                    </h2>
                  );
                }
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3
                      key={index}
                      className="text-sm md:text-base font-bold text-[#063F3F] pt-2"
                    >
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('#### ')) {
                  return (
                    <h4
                      key={index}
                      className="text-xs md:text-sm font-semibold text-[#102A2A] pt-1"
                    >
                      {trimmed.replace('#### ', '')}
                    </h4>
                  );
                }

                // Horizontal Rule
                if (trimmed === '---') {
                  return <hr key={index} className="border-t border-[#E5EDE9] my-4" />;
                }

                // Code Blocks
                if (trimmed.startsWith('```')) {
                  const lines = trimmed.split('\n');
                  const code = lines.slice(1, -1).join('\n');
                  return (
                    <div
                      key={index}
                      className="my-3 p-4 bg-[#0A1F1F] text-[#E2ECE9] font-mono text-xs rounded-xl overflow-x-auto shadow-xs border border-[#102A2A]"
                    >
                      <pre>
                        <code>{code}</code>
                      </pre>
                    </div>
                  );
                }

                // Ordered / Unordered lists
                if (trimmed.startsWith('- ') || trimmed.match(/^\d+\.\s/)) {
                  const items = trimmed.split('\n');
                  const isOrdered = Boolean(trimmed.match(/^\d+\.\s/));

                  if (isOrdered) {
                    return (
                      <ol key={index} className="list-decimal list-inside space-y-1 pl-2 text-[#2D3E3E]">
                        {items.map((item, i) => (
                          <li key={i} className="leading-relaxed">
                            {item.replace(/^\d+\.\s/, '')}
                          </li>
                        ))}
                      </ol>
                    );
                  }

                  return (
                    <ul key={index} className="list-disc list-inside space-y-1 pl-2 text-[#2D3E3E]">
                      {items.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item.replace(/^- \[[ x]\]\s|- \s?/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Table representation
                if (trimmed.includes('|')) {
                  const rows = trimmed.split('\n').filter((r) => !r.includes(':---'));
                  if (rows.length > 1) {
                    return (
                      <div key={index} className="overflow-x-auto my-3">
                        <table className="w-full text-left text-xs border-collapse">
                          <tbody>
                            {rows.map((row, rIdx) => {
                              const cells = row
                                .split('|')
                                .map((c) => c.trim())
                                .filter(Boolean);
                              if (rIdx === 0) {
                                return (
                                  <tr key={rIdx} className="bg-[#F3F9F7] font-semibold text-[#063F3F] border-b border-[#E5EDE9]">
                                    {cells.map((cell, cIdx) => (
                                      <th key={cIdx} className="py-2 px-3">
                                        {cell.replace(/\*\*/g, '')}
                                      </th>
                                    ))}
                                  </tr>
                                );
                              }
                              return (
                                <tr key={rIdx} className="border-b border-[#E5EDE9]/60 hover:bg-[#F3F9F7]/30">
                                  {cells.map((cell, cIdx) => (
                                    <td key={cIdx} className="py-2 px-3">
                                      {cell.replace(/\*\*/g, '')}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                }

                // Standard paragraph
                return (
                  <p key={index} className="text-[#374949] leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Keyword Tags */}
            <div className="pt-4 border-t border-[#F1F5F4] flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-[#6B7F7F]">Keywords:</span>
              {article.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#F3F9F7] text-[#4B6358] border border-[#E5EDE9]"
                >
                  #{kw}
                </span>
              ))}
            </div>

            {/* Helpful Feedback Widget */}
            <div className="pt-2">
              <ArticleFeedback articleId={article.id} />
            </div>
          </Card>
        </div>

        {/* Sidebar Column: Related Articles & Escalation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Unresolved Escalation CTA Box */}
          <Card className="p-5 bg-gradient-to-br from-white to-[#F3F9F7] border border-[#D5EADB] space-y-3">
            <div className="h-9 w-9 rounded-lg bg-[#DDF4E9] text-[#063F3F] flex items-center justify-center border border-[#BBF7D0]">
              <PlusIcon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#102A2A]">
                Didn&apos;t solve your problem?
              </h3>
              <p className="text-xs text-[#6B7F7F] mt-1 leading-relaxed">
                If this guide didn&apos;t resolve your issue, you can create a unified Ticket and our specialists will handle it for you.
              </p>
            </div>
            <div className="pt-1">
              <Link href="/tickets/create" className="block">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  rightIcon={<ArrowUpRightIcon size={14} />}
                >
                  Create a Ticket
                </Button>
              </Link>
            </div>
          </Card>

          {/* Related Articles List */}
          {relatedArticles.length > 0 && (
            <Card className="p-5 space-y-4">
              <div className="border-b border-[#E5EDE9] pb-2">
                <h3 className="text-sm font-bold text-[#102A2A]">
                  Related Articles
                </h3>
                <p className="text-[11px] text-[#6B7F7F]">
                  Guides frequently referenced with this topic
                </p>
              </div>

              <div className="space-y-3">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/knowledge-base/${rel.id}`}
                    className="group block p-3 rounded-lg border border-[#E5EDE9] hover:border-[#063F3F]/40 hover:bg-[#F3F9F7]/40 transition-colors"
                  >
                    <span className="text-[10px] font-semibold text-[#063F3F] block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-semibold text-[#102A2A] group-hover:text-[#063F3F] leading-snug line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-[10px] text-[#6B7F7F] mt-1.5 block">
                      {rel.readingTime} • {rel.viewCount.toLocaleString()} views
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Back to Guides Link */}
          <div className="text-center">
            <Link
              href="/knowledge-base"
              className="text-xs font-semibold text-[#063F3F] hover:underline inline-flex items-center gap-1"
            >
              <ChevronLeftIcon size={14} />
              <span>Back to Knowledge Base</span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
