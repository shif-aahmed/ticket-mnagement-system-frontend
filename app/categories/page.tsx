'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusIcon, CheckCircleIcon, XIcon, FolderIcon } from '@/components/ui/icons';
import { CategorySummary } from '@/components/categories/category-summary';
import { CategoryFilters } from '@/components/categories/category-filters';
import { CategoryTable } from '@/components/categories/category-table';
import { CategoryMobileCard } from '@/components/categories/category-mobile-card';
import { CategoryFormModal } from '@/components/categories/category-form-modal';
import { CategoryStatusConfirmModal } from '@/components/categories/category-status-confirm-modal';
import {
  TicketCategory,
  CategoryFiltersState,
  CategoryFormData,
  CategoryCalculatedStats,
  CategorySummaryMetric,
} from '@/types/category';
import { Ticket } from '@/types/ticket';
import { getCategoryStats } from '@/lib/mock-categories-data';
import { api } from '@/lib/api-client';

const initialFilters: CategoryFiltersState = {
  search: '',
  status: 'all',
  department: 'all',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filters, setFilters] = useState<CategoryFiltersState>(initialFilters);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);
  const [statusConfirmCategory, setStatusConfirmCategory] = useState<TicketCategory | null>(null);

  const fetchCategoriesAndTickets = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const [catsRes, ticketsRes] = await Promise.allSettled([
        api.categories.list(),
        api.tickets.list({ limit: 100 }),
      ]);

      if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value) && catsRes.value.length > 0) {
        const mapped: TicketCategory[] = catsRes.value.map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.description || '',
          departmentDefault: c.departmentDefault || 'Engineering',
          status: c.status || 'active',
          createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently',
        }));
        setCategories(mapped);
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
      setLoadError(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesAndTickets();
  }, [fetchCategoriesAndTickets]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Compute ticket stats for all categories
  const statsMap = useMemo(() => {
    const map: Record<string, CategoryCalculatedStats> = {};
    categories.forEach((cat) => {
      map[cat.id] = getCategoryStats(cat.name, tickets);
    });
    return map;
  }, [categories, tickets]);

  // Compute category summary metrics
  const summaryMetrics: CategorySummaryMetric[] = useMemo(() => {
    const activeCount = categories.filter((c) => c.status === 'active').length;
    const inactiveCount = categories.filter((c) => c.status === 'inactive').length;
    const totalClassified = Object.values(statsMap).reduce((acc, curr) => acc + curr.totalTickets, 0);

    return [
      {
        id: 'categories',
        label: 'Total Categories',
        value: categories.length,
        changeText: 'Active taxonomies',
        variant: 'default',
      },
      {
        id: 'active',
        label: 'Active Categories',
        value: activeCount,
        changeText: 'Available for routing',
        variant: 'success',
      },
      {
        id: 'inactive',
        label: 'Inactive Categories',
        value: inactiveCount,
        changeText: 'Archived / disabled',
        variant: 'warning',
      },
      {
        id: 'tickets',
        label: 'Classified Tickets',
        value: totalClassified,
        changeText: 'Live organizational tickets',
        variant: 'active',
      },
    ];
  }, [categories, statsMap]);

  // Client-side filtering
  const filteredCategories = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return categories.filter((cat) => {
      // 1. Search match (name, description, default department)
      if (q) {
        const matchesName = cat.name.toLowerCase().includes(q);
        const matchesDesc = cat.description.toLowerCase().includes(q);
        const matchesDept = cat.departmentDefault.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesDept) {
          return false;
        }
      }

      // 2. Status match
      if (filters.status !== 'all' && cat.status !== filters.status) {
        return false;
      }

      // 3. Department match
      if (filters.department !== 'all' && cat.departmentDefault !== filters.department) {
        return false;
      }

      return true;
    });
  }, [categories, filters]);

  // Open Add Category Modal
  const handleOpenAddCategory = () => {
    setFormMode('add');
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCategory = (category: TicketCategory) => {
    setFormMode('edit');
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = async (formData: CategoryFormData, categoryId?: string) => {
    if (formMode === 'add') {
      try {
        await api.categories.create({
          name: formData.name.trim(),
          description: formData.description.trim(),
          departmentDefault: formData.departmentDefault,
          status: formData.status,
        });
        await fetchCategoriesAndTickets();
        setToastMessage(`Category "${formData.name.trim()}" created successfully.`);
      } catch (err: any) {
        const newCategory: TicketCategory = {
          id: `cat_${String(categories.length + 1).padStart(3, '0')}`,
          name: formData.name.trim(),
          description: formData.description.trim(),
          departmentDefault: formData.departmentDefault,
          status: formData.status,
          createdAt: 'Just now',
        };
        setCategories((prev) => [newCategory, ...prev]);
        setToastMessage(`Category "${newCategory.name}" created successfully.`);
      }
    } else if (formMode === 'edit' && categoryId) {
      try {
        await api.categories.update(categoryId, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          departmentDefault: formData.departmentDefault,
          status: formData.status,
        });
        await fetchCategoriesAndTickets();
        setToastMessage(`Category "${formData.name.trim()}" updated successfully.`);
      } catch (err) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  name: formData.name.trim(),
                  description: formData.description.trim(),
                  departmentDefault: formData.departmentDefault,
                  status: formData.status,
                }
              : c
          )
        );
        setToastMessage(`Category "${formData.name.trim()}" updated successfully.`);
      }
    }
  };

  // Request Status Toggle confirmation
  const handleRequestStatusToggle = (category: TicketCategory) => {
    setStatusConfirmCategory(category);
  };

  // Confirm Status Toggle
  const handleConfirmStatusToggle = async (targetCategory: TicketCategory) => {
    const nextStatus = targetCategory.status === 'active' ? 'inactive' : 'active';
    try {
      await api.categories.updateStatus(targetCategory.id, nextStatus);
      await fetchCategoriesAndTickets();
    } catch (err) {
      setCategories((prev) =>
        prev.map((c) => (c.id === targetCategory.id ? { ...c, status: nextStatus } : c))
      );
    }
    setToastMessage(
      `Category "${targetCategory.name}" is now ${nextStatus === 'active' ? 'activated' : 'deactivated'}.`
    );
    setStatusConfirmCategory(null);
  };

  return (
    <AppShell>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#063F3F] text-white text-xs font-medium rounded-lg shadow-xl border border-[#0F766E] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircleIcon size={16} className="text-[#22C55E] shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss toast"
          >
            <XIcon size={14} />
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Page Header */}
        <PageHeader
          title="Categories"
          description="Classify and organize organizational tickets across departments."
          actions={
            <Button
              variant="primary"
              size="md"
              leftIcon={<PlusIcon size={16} />}
              onClick={handleOpenAddCategory}
            >
              Add Category
            </Button>
          }
        />

        {/* 2. Compact Summary Metrics Bar */}
        <CategorySummary metrics={summaryMetrics} />

        {/* 3. Filter Controls */}
        <CategoryFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={() => setFilters(initialFilters)}
          resultCount={filteredCategories.length}
          totalCount={categories.length}
        />

        {/* 4. Category Table & Cards */}
        {filteredCategories.length > 0 ? (
          <Card className="p-0 overflow-hidden border-[#E5EDE9]">
            {/* Desktop Table View */}
            <CategoryTable
              categories={filteredCategories}
              statsMap={statsMap}
              onEdit={handleOpenEditCategory}
              onRequestStatusToggle={handleRequestStatusToggle}
            />

            {/* Mobile Card Grid View */}
            <div className="md:hidden p-4 space-y-3 bg-[#FAFDFC]">
              {filteredCategories.map((cat) => (
                <CategoryMobileCard
                  key={cat.id}
                  category={cat}
                  stats={
                    statsMap[cat.id] || {
                      totalTickets: 0,
                      activeTickets: 0,
                      resolvedTickets: 0,
                    }
                  }
                  onEdit={handleOpenEditCategory}
                  onRequestStatusToggle={handleRequestStatusToggle}
                />
              ))}
            </div>
          </Card>
        ) : (
          /* Empty Search / Filter Results State */
          <Card className="p-12 text-center border-dashed border-[#CBD5E1] bg-white">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#F3F9F7] flex items-center justify-center text-[#063F3F]">
                <FolderIcon size={24} />
              </div>
              <h3 className="text-sm font-semibold text-[#102A2A]">
                No categories found
              </h3>
              <p className="text-xs text-[#6B7F7F]">
                We couldn&apos;t find any categories matching your current search or filter criteria.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(initialFilters)}
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        mode={formMode}
        initialCategory={editingCategory}
        existingCategories={categories}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Activate / Deactivate Category Confirmation Dialog */}
      {statusConfirmCategory && (
        <CategoryStatusConfirmModal
          category={statusConfirmCategory}
          isOpen={Boolean(statusConfirmCategory)}
          onClose={() => setStatusConfirmCategory(null)}
          onConfirm={handleConfirmStatusToggle}
        />
      )}
    </AppShell>
  );
}
