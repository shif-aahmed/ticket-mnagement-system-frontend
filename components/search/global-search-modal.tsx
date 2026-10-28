'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  TicketsIcon,
  UsersIcon,
  TeamsIcon,
  CategoriesIcon,
  BookOpenIcon,
  SearchIcon,
  XIcon,
  ArrowUpRightIcon,
} from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { GroupedSearchResults, SearchEntityType } from '@/types/search';
import { api } from '@/lib/api-client';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptyResults: GroupedSearchResults = {
  tickets: [],
  users: [],
  teams: [],
  categories: [],
  articles: [],
  totalResults: 0,
};

const entityTabs: { id: 'all' | SearchEntityType; label: string }[] = [
  { id: 'all', label: 'All Results' },
  { id: 'ticket', label: 'Tickets' },
  { id: 'user', label: 'Users' },
  { id: 'team', label: 'Teams' },
  { id: 'category', label: 'Categories' },
  { id: 'article', label: 'Knowledge Base' },
];

export const GlobalSearchModal = ({ isOpen, onClose }: GlobalSearchModalProps) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | SearchEntityType>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<GroupedSearchResults>(emptyResults);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveTab('all');
      setResults(emptyResults);
    }
  }, [isOpen]);

  // Debounced search via real backend API
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(emptyResults);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.search.global(trimmed);
        if (res && typeof res.totalResults === 'number') {
          setResults(res);
        } else {
          setResults(emptyResults);
        }
      } catch {
        setResults(emptyResults);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const flatResults = useMemo(() => {
    if (activeTab === 'all') {
      return [
        ...results.tickets,
        ...results.users,
        ...results.teams,
        ...results.categories,
        ...results.articles,
      ];
    }
    if (activeTab === 'ticket') return results.tickets;
    if (activeTab === 'user') return results.users;
    if (activeTab === 'team') return results.teams;
    if (activeTab === 'category') return results.categories;
    if (activeTab === 'article') return results.articles;
    return [];
  }, [results, activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (flatResults.length > 0 ? (prev + 1) % flatResults.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          flatResults.length > 0 ? (prev - 1 + flatResults.length) % flatResults.length : 0
        );
      } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
        e.preventDefault();
        router.push(flatResults[selectedIndex].href);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatResults, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  const getEntityIcon = (type: SearchEntityType) => {
    switch (type) {
      case 'ticket':
        return <TicketsIcon size={16} className="text-[#063F3F]" />;
      case 'user':
        return <UsersIcon size={16} className="text-[#0F766E]" />;
      case 'team':
        return <TeamsIcon size={16} className="text-[#0284C7]" />;
      case 'category':
        return <CategoriesIcon size={16} className="text-[#8B5CF6]" />;
      case 'article':
        return <BookOpenIcon size={16} className="text-[#D97706]" />;
    }
  };

  const handleSelectResult = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-start justify-center p-3 sm:p-6 pt-16 md:pt-24">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global search dialog"
        className="bg-white rounded-2xl border border-[#E5EDE9] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh] text-left"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5EDE9] bg-[#FAFDFC]">
          <SearchIcon size={18} className="text-[#6B7F7F] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tickets, users, teams, categories, knowledge base..."
            className="flex-1 text-sm bg-transparent placeholder-[#94A3B8] text-[#102A2A] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-[#94A3B8] hover:text-[#102A2A] p-1 cursor-pointer"
              aria-label="Clear search input"
            >
              <XIcon size={16} />
            </button>
          )}
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-mono bg-[#E5EDE9] text-[#475569]">
            ESC
          </span>
        </div>

        {/* Entity Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#F1F5F4] bg-white overflow-x-auto">
          {entityTabs.map((tab) => {
            const count =
              tab.id === 'all'
                ? results.totalResults
                : tab.id === 'ticket'
                ? results.tickets.length
                : tab.id === 'user'
                ? results.users.length
                : tab.id === 'team'
                ? results.teams.length
                : tab.id === 'category'
                ? results.categories.length
                : results.articles.length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#064747] text-white'
                    : 'text-[#6B7F7F] hover:text-[#102A2A] hover:bg-[#F3F9F7]'
                }`}
              >
                <span>{tab.label}</span>
                {query.trim() && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E5EDE9] text-[#475569]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {!query.trim() ? (
            /* Suggested Quick Navigation */
            <div className="p-6 text-center space-y-4">
              <p className="text-xs text-[#6B7F7F]">
                Quickly jump across TicketGo by searching tickets, people, teams, or knowledge.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-md mx-auto text-left">
                <button
                  type="button"
                  onClick={() => setQuery('VPN')}
                  className="p-2.5 rounded-lg border border-[#E5EDE9] hover:bg-[#F3F9F7] text-xs transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-[#102A2A] block">“VPN”</span>
                  <span className="text-[11px] text-[#6B7F7F]">Support & Articles</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('Engineering')}
                  className="p-2.5 rounded-lg border border-[#E5EDE9] hover:bg-[#F3F9F7] text-xs transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-[#102A2A] block">“Engineering”</span>
                  <span className="text-[11px] text-[#6B7F7F]">Teams & Tickets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('Critical')}
                  className="p-2.5 rounded-lg border border-[#E5EDE9] hover:bg-[#F3F9F7] text-xs transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-[#102A2A] block">“Critical”</span>
                  <span className="text-[11px] text-[#6B7F7F]">Urgent Incidents</span>
                </button>
              </div>
            </div>
          ) : flatResults.length > 0 ? (
            /* Render Grouped Results */
            <div className="space-y-1">
              {flatResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.type + item.id}
                    onClick={() => handleSelectResult(item.href)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#F3F9F7] border border-[#CBD5E1]'
                        : 'hover:bg-[#FAFDFC] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-white border border-[#E5EDE9] flex items-center justify-center shrink-0 shadow-sm">
                        {getEntityIcon(item.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-[#102A2A] group-hover:text-[#063F3F] truncate">
                            {item.title}
                          </h4>
                          {item.badge && (
                            <Badge variant={item.badgeVariant || 'neutral'} size="sm">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7F7F] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {item.metadata && (
                        <span className="hidden sm:inline text-[11px] text-[#94A3B8]">
                          {item.metadata}
                        </span>
                      )}
                      <ArrowUpRightIcon
                        size={14}
                        className={`text-[#6B7F7F] transition-transform ${
                          isSelected ? 'translate-x-0.5 -translate-y-0.5 text-[#064747]' : ''
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* No Results State */
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-[#102A2A]">
                No matching results found
              </p>
              <p className="text-xs text-[#6B7F7F]">
                We couldn&apos;t find any tickets, users, teams, categories, or articles for &ldquo;{query}&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2.5 border-t border-[#E5EDE9] bg-[#FAFDFC] flex items-center justify-between text-[11px] text-[#6B7F7F]">
          <span>
            {query.trim()
              ? `${flatResults.length} result${flatResults.length === 1 ? '' : 's'}`
              : 'Type to begin searching'}
          </span>
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-[#E5EDE9] px-1.5 py-0.5 rounded text-[10px]">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="font-mono bg-[#E5EDE9] px-1.5 py-0.5 rounded text-[10px]">↵</kbd> Select
            </span>
            <span>
              <kbd className="font-mono bg-[#E5EDE9] px-1.5 py-0.5 rounded text-[10px]">ESC</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
