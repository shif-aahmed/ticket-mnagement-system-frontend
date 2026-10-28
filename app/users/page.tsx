'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon, CheckCircleIcon, XIcon } from '@/components/ui/icons';
import { Card } from '@/components/ui/card';
import { UserSummary } from '@/components/users/user-summary';
import { UserFilters } from '@/components/users/user-filters';
import { UserTable } from '@/components/users/user-table';
import { UserMobileCard } from '@/components/users/user-mobile-card';
import { UserEmptyState } from '@/components/users/user-empty-state';
import { UserDetailsModal } from '@/components/users/user-details-modal';
import { UserFormModal } from '@/components/users/user-form-modal';
import { UserStatusConfirmModal } from '@/components/users/user-status-confirm-modal';
import { AdminUser, UserFiltersState, UserFormData } from '@/types/user';
import { api } from '@/lib/api-client';

const initialFilters: UserFiltersState = {
  search: '',
  role: 'all',
  status: 'all',
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filters, setFilters] = useState<UserFiltersState>(initialFilters);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modals state
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [statusConfirmUser, setStatusConfirmUser] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await api.users.list({ limit: 100 });
      const rawList = res?.items || res?.users || (Array.isArray(res) ? res : null);
      if (rawList && Array.isArray(rawList)) {
        const mapped: AdminUser[] = rawList.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatarUrl: u.avatarUrl,
          role: u.role,
          department: u.department || 'General',
          status: u.status || 'active',
          lastActive: u.lastActive ? new Date(u.lastActive).toLocaleDateString() : 'Recently',
          createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recently',
          phone: u.phone,
          activity: {
            lastAction: 'Active account in system',
            timestamp: 'Recently',
            ticketCount: u._count?.assignedTickets || u._count?.requestedTickets || 0,
          },
        }));
        setUsers(mapped);
      }
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-dismiss confirmation toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Client-side filtering
  const filteredUsers = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return users.filter((user) => {
      // 1. Search match (name or email)
      if (q) {
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesEmail = user.email.toLowerCase().includes(q);
        const matchesDept = user.department.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesDept) {
          return false;
        }
      }

      // 2. Role match
      if (filters.role !== 'all' && user.role !== filters.role) {
        return false;
      }

      // 3. Status match
      if (filters.status !== 'all' && user.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [users, filters]);

  // Handle opening Add User modal
  const handleOpenAddUser = () => {
    setFormMode('add');
    setEditingUser(null);
    setIsFormOpen(true);
  };

  // Handle opening Edit User modal
  const handleOpenEditUser = (user: AdminUser) => {
    setFormMode('edit');
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // Handle form submission (both Add and Edit)
  const handleFormSubmit = async (formData: UserFormData, userId?: string) => {
    if (formMode === 'add') {
      try {
        const res = await api.users.create({
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          department: formData.department,
          password: 'Password123!',
        });
        await fetchUsers();
        setToastMessage(`User "${formData.name}" added successfully.`);
      } catch (err: any) {
        setToastMessage(`Error: Failed to add user — ${err.message || 'Unknown error'}`);
      }
    } else if (formMode === 'edit' && userId) {
      try {
        await api.users.update(userId, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          department: formData.department,
        });
        await fetchUsers();
        setToastMessage(`User "${formData.name}" updated successfully.`);
      } catch (err: any) {
        setToastMessage(`Error: Failed to update user — ${err.message || 'Unknown error'}`);
      }

      // If currently viewing the edited user, update viewing state as well
      if (viewingUser && viewingUser.id === userId) {
        setViewingUser((prev) =>
          prev
            ? {
                ...prev,
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
                department: formData.department,
                status: formData.status,
                lastActive: 'Just now',
              }
            : null
        );
      }
    }
  };

  // Handle status toggle (Activate / Deactivate)
  const handleConfirmStatusToggle = async (targetUser: AdminUser) => {
    const nextStatus = targetUser.status === 'active' ? 'inactive' : 'active';

    try {
      await api.users.updateStatus(targetUser.id, nextStatus);
      await fetchUsers();
    } catch (err: any) {
      setToastMessage(`Error: Failed to update user status — ${err.message || 'Unknown error'}`);
      return;
    }

    // If viewing the user, keep viewing state in sync
    if (viewingUser && viewingUser.id === targetUser.id) {
      setViewingUser((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
              lastActive: 'Just now',
            }
          : null
      );
    }

    const actionText = nextStatus === 'active' ? 'activated' : 'deactivated';
    setToastMessage(`User "${targetUser.name}" ${actionText} successfully.`);
  };

  const isFiltered =
    filters.search.trim() !== '' ||
    filters.role !== 'all' ||
    filters.status !== 'all';

  return (
    <AppShell
      title="Users"
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Users' },
      ]}
    >
      {/* 1. Page Header */}
      <PageHeader
        title="Users"
        description="Manage users, roles, access, and account status."
        actions={
          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleOpenAddUser}
          >
            Add User
          </Button>
        }
      />

      <div className="space-y-6">
        {/* 2. Compact 5-Metric Summary Bar */}
        <UserSummary users={users} />

        {/* 3. Search and Filter Bar */}
        <UserFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={() => setFilters(initialFilters)}
        />

        {/* 4. Results Section: Desktop Table, Mobile Cards, or Empty/Loading/Error State */}
        {loading ? (
          <Card className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-[#063F3F] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#6B7F7F] font-medium">Loading users...</p>
            </div>
          </Card>
        ) : loadError ? (
          <Card className="py-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="h-10 w-10 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center border border-[#FECACA]">⚠</div>
              <p className="text-sm font-semibold text-[#102A2A]">Failed to load users</p>
              <p className="text-xs text-[#6B7F7F]">{loadError}</p>
            </div>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <UserEmptyState
            onClearFilters={() => setFilters(initialFilters)}
            isFiltered={isFiltered}
          />
        ) : (
          <div className="space-y-4">
            {/* Desktop Table Card Wrapper */}
            <Card className="hidden md:block overflow-hidden">
              <UserTable
                users={filteredUsers}
                onViewUser={(u) => setViewingUser(u)}
                onEditUser={handleOpenEditUser}
                onRequestStatusToggle={(u) => setStatusConfirmUser(u)}
              />
            </Card>

            {/* Mobile Stacked Cards */}
            <div className="md:hidden space-y-3">
              {filteredUsers.map((user) => (
                <UserMobileCard
                  key={user.id}
                  user={user}
                  onViewUser={(u) => setViewingUser(u)}
                  onEditUser={handleOpenEditUser}
                  onRequestStatusToggle={(u) => setStatusConfirmUser(u)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View User Details Modal */}
      {viewingUser && (
        <UserDetailsModal
          user={viewingUser}
          isOpen={Boolean(viewingUser)}
          onClose={() => setViewingUser(null)}
          onEdit={(u) => handleOpenEditUser(u)}
        />
      )}

      {/* Reusable Add / Edit User Form Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        mode={formMode}
        initialUser={editingUser}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Status Toggle Confirmation Modal */}
      {statusConfirmUser && (
        <UserStatusConfirmModal
          user={statusConfirmUser}
          isOpen={Boolean(statusConfirmUser)}
          onClose={() => setStatusConfirmUser(null)}
          onConfirm={handleConfirmStatusToggle}
        />
      )}

      {/* Floating Local Confirmation Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#063F3F] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#0B5252] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircleIcon size={18} className="text-[#22C55E] shrink-0" />
          <div className="text-xs space-y-0.5 min-w-0 flex-1">
            <p className="font-semibold text-white">Local Confirmation</p>
            <p className="text-slate-200 text-[11px] leading-snug">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-300 hover:text-white p-1 -mr-1 transition-colors"
            aria-label="Dismiss notification"
          >
            <XIcon size={14} />
          </button>
        </div>
      )}
    </AppShell>
  );
}
