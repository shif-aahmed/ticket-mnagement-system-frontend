'use client';

import React, { useState, useEffect } from 'react';
import { TicketCategory, CategoryStatus, CategoryFormData, CategoryFormErrors } from '@/types/category';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { XIcon, CheckCircleIcon } from '@/components/ui/icons';
import { CATEGORY_STATUS_OPTIONS } from '@/lib/mock-categories-data';
import { TICKET_DEPARTMENTS } from '@/lib/mock-tickets-data';

export interface CategoryFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialCategory?: TicketCategory | null;
  existingCategories?: TicketCategory[];
  onClose: () => void;
  onSubmit: (formData: CategoryFormData, categoryId?: string) => void;
}

const defaultFormData: CategoryFormData = {
  name: '',
  description: '',
  departmentDefault: 'Engineering',
  status: 'active',
};

export const CategoryFormModal = ({
  isOpen,
  mode,
  initialCategory,
  existingCategories = [],
  onClose,
  onSubmit,
}: CategoryFormModalProps) => {
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData);
  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialCategory) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          name: initialCategory.name,
          description: initialCategory.description,
          departmentDefault: initialCategory.departmentDefault,
          status: initialCategory.status,
        });
      } else {
        setFormData(defaultFormData);
      }
      setErrors({});
      setValidationSuccess(null);
    }
  }, [isOpen, mode, initialCategory]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !validationSuccess) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, validationSuccess, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: CategoryFormErrors = {};

    // 1. Name
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Category name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Category name must be at least 2 characters.';
    } else {
      // Check for duplicate name (case-insensitive)
      const duplicate = existingCategories.some(
        (c) =>
          c.name.toLowerCase() === trimmedName.toLowerCase() &&
          (mode !== 'edit' || c.id !== initialCategory?.id)
      );
      if (duplicate) {
        newErrors.name = 'A category with this name already exists.';
      }
    }

    // 2. Description
    const trimmedDesc = formData.description.trim();
    if (!trimmedDesc) {
      newErrors.description = 'Description is required.';
    } else if (trimmedDesc.length < 5) {
      newErrors.description = 'Description should be at least 5 characters.';
    }

    // 3. Department
    if (!formData.departmentDefault) {
      newErrors.departmentDefault = 'Default department is required.';
    }

    // 4. Status
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
        ? 'Category created successfully.'
        : 'Category updated successfully.';
    setValidationSuccess(successMsg);

    setTimeout(() => {
      onSubmit(formData, initialCategory?.id);
      onClose();
    }, 500);
  };

  const handleFieldChange = <K extends keyof CategoryFormData>(
    field: K,
    val: CategoryFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isEdit = mode === 'edit';
  const modalTitle = isEdit ? 'Edit Category' : 'Add New Category';
  const modalSubtitle = isEdit
    ? `Update configuration for category "${initialCategory?.name || ''}".`
    : 'Define a work classification to organize organizational tickets.';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        className="bg-white rounded-xl border border-[#E5EDE9] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EDE9] bg-[#FAFDFC]">
          <div className="space-y-0.5">
            <h3 id="category-form-title" className="text-base font-bold text-[#102A2A]">
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

            {/* Category Name */}
            <Input
              label="Category Name *"
              id="category-form-name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="e.g. Security & Compliance"
              errorMessage={errors.name}
              disabled={Boolean(validationSuccess)}
              aria-required="true"
            />

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="category-form-desc"
                className="block text-xs font-medium text-[#102A2A]"
              >
                Description *
              </label>
              <textarea
                id="category-form-desc"
                rows={3}
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Briefly describe what tickets belong under this category..."
                disabled={Boolean(validationSuccess)}
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white placeholder-[#94A3B8] focus:outline-none transition-colors ${
                  errors.description
                    ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
                    : 'border-[#CBD5E1] focus:border-[#064747] focus:ring-1 focus:ring-[#064747]'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-[#EF4444]">{errors.description}</p>
              )}
            </div>

            {/* Default Department & Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Default Department */}
              <Select
                label="Default Department *"
                id="category-form-dept"
                value={formData.departmentDefault}
                onChange={(e) =>
                  handleFieldChange('departmentDefault', e.target.value)
                }
                errorMessage={errors.departmentDefault}
                disabled={Boolean(validationSuccess)}
                helperText="Primary team handling this category"
                aria-required="true"
              >
                {TICKET_DEPARTMENTS.map((dept: string) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>

              {/* Status Select */}
              <Select
                label="Status *"
                id="category-form-status"
                value={formData.status}
                onChange={(e) =>
                  handleFieldChange('status', e.target.value as CategoryStatus)
                }
                errorMessage={errors.status}
                disabled={Boolean(validationSuccess)}
                helperText="Inactive categories cannot be assigned to new tickets"
                aria-required="true"
              >
                {CATEGORY_STATUS_OPTIONS.map((opt: { value: string; label: string }) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="pt-1 text-[11px] text-[#6B7F7F]">
              Tickets are the single unit of work across all departments. Categories organize routing and reporting.
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
              {isEdit ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
