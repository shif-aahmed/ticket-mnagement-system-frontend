'use client';

import React, { useState, useEffect } from 'react';
import { AdminUser, AdminUserRole, AdminUserStatus, UserFormData, UserFormErrors } from '@/types/user';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { XIcon, CheckCircleIcon } from '@/components/ui/icons';
import { USER_DEPARTMENTS, USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '@/lib/mock-users-data';

export interface UserFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialUser?: AdminUser | null;
  onClose: () => void;
  onSubmit: (formData: UserFormData, userId?: string) => void;
}

const defaultFormData: UserFormData = {
  name: '',
  email: '',
  role: 'employee',
  department: 'Engineering',
  status: 'active',
};

export const UserFormModal = ({
  isOpen,
  mode,
  initialUser,
  onClose,
  onSubmit,
}: UserFormModalProps) => {
  const [formData, setFormData] = useState<UserFormData>(defaultFormData);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  // Sync form data on open or initialUser change
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialUser) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          name: initialUser.name,
          email: initialUser.email,
          role: initialUser.role,
          department: initialUser.department,
          status: initialUser.status,
        });
      } else {
        setFormData(defaultFormData);
      }
      setErrors({});
      setValidationSuccess(null);
    }
  }, [isOpen, mode, initialUser]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !validationSuccess) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, validationSuccess, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: UserFormErrors = {};

    // 1. Full Name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    // 2. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g., user@company.com).';
    }

    // 3. Role
    if (!formData.role) {
      newErrors.role = 'Role selection is required.';
    }

    // 4. Department
    if (!formData.department) {
      newErrors.department = 'Department is required.';
    }

    // 5. Status
    if (!formData.status) {
      newErrors.status = 'Status is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const successMsg =
      mode === 'add'
        ? 'User form validated successfully.'
        : 'User changes validated successfully.';
    setValidationSuccess(successMsg);

    setTimeout(() => {
      onSubmit(formData, initialUser?.id);
      onClose();
    }, 600);
  };

  const handleFieldChange = <K extends keyof UserFormData>(field: K, val: UserFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isEdit = mode === 'edit';
  const modalTitle = isEdit ? 'Edit User' : 'Add New User';
  const modalSubtitle = isEdit
    ? `Update profile and permissions for ${initialUser?.name || 'user'}.`
    : 'Create a new employee, agent, or administrator account.';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
        className="bg-white rounded-xl border border-[#E5EDE9] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EDE9] bg-[#FAFDFC]">
          <div className="space-y-0.5">
            <h3 id="user-form-title" className="text-base font-bold text-[#102A2A]">
              {modalTitle}
            </h3>
            <p className="text-xs text-[#6B7F7F]">{modalSubtitle}</p>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Close form"
            onClick={onClose}
            className="text-[#6B7F7F] hover:text-[#102A2A]"
          >
            <XIcon size={16} />
          </IconButton>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Inline validation feedback banner */}
            {validationSuccess && (
              <div className="p-3 bg-[#DDF4E9] border border-[#22C55E]/40 rounded-lg flex items-center gap-2 text-xs font-medium text-[#063F3F] animate-in fade-in">
                <CheckCircleIcon size={16} className="text-[#22C55E] shrink-0" />
                <span>{validationSuccess}</span>
              </div>
            )}

            {/* Full Name */}
            <Input
              label="Full Name *"
              id="user-form-name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="e.g. Jane Doe"
              errorMessage={errors.name}
              disabled={Boolean(validationSuccess)}
              aria-required="true"
            />

            {/* Email Address */}
            <Input
              label="Email Address *"
              id="user-form-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="e.g. jane.doe@ticketgo.io"
              errorMessage={errors.email}
              disabled={Boolean(validationSuccess)}
              aria-required="true"
            />

            {/* Role & Department Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Role Select */}
              <Select
                label="Role *"
                id="user-form-role"
                value={formData.role}
                onChange={(e) =>
                  handleFieldChange('role', e.target.value as AdminUserRole)
                }
                errorMessage={errors.role}
                disabled={Boolean(validationSuccess)}
                aria-required="true"
              >
                {USER_ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>

              {/* Department Select */}
              <Select
                label="Department *"
                id="user-form-department"
                value={formData.department}
                onChange={(e) => handleFieldChange('department', e.target.value)}
                errorMessage={errors.department}
                disabled={Boolean(validationSuccess)}
                aria-required="true"
              >
                {USER_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
            </div>

            {/* Status Select */}
            <Select
              label="Status *"
              id="user-form-status"
              value={formData.status}
              onChange={(e) =>
                handleFieldChange('status', e.target.value as AdminUserStatus)
              }
              errorMessage={errors.status}
              disabled={Boolean(validationSuccess)}
              helperText="Active accounts can sign in and participate in ticket routing."
              aria-required="true"
            >
              {USER_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>

            {/* Session Disclaimer */}
            <div className="pt-1 text-[11px] text-[#6B7F7F]">
              Note: This is a frontend session demonstration. No backend or database modifications will occur.
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#E5EDE9] bg-[#FAFDFC]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={Boolean(validationSuccess)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={Boolean(validationSuccess)}
            >
              {isEdit ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
