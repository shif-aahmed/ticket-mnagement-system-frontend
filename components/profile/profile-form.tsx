'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, EditIcon } from '@/components/ui/icons';

export interface ProfileFormProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => Promise<void> | void;
}

const DEPARTMENTS = [
  'Engineering',
  'Customer Support',
  'IT & Security',
  'Product & Design',
  'Billing & Operations',
  'Legal & Compliance',
];

const TIMEZONES = [
  'America/New_York (UTC-5 / Eastern)',
  'America/Chicago (UTC-6 / Central)',
  'America/Denver (UTC-7 / Mountain)',
  'America/Los_Angeles (UTC-8 / Pacific)',
  'Europe/London (UTC+0 / GMT)',
  'Europe/Paris (UTC+1 / CET)',
  'Asia/Tokyo (UTC+9 / JST)',
  'Asia/Singapore (UTC+8 / SGT)',
];

export const ProfileForm = ({ user, onSave }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({ ...user });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid corporate email.';
    }

    if (!formData.title?.trim()) {
      errs.title = 'Job title is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setErrors({});
    setErrorMessage(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSave(formData);
      setIsEditing(false);
      setSuccessMessage('Profile information updated successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-[#E5EDE9] bg-white text-left">
      <CardHeader className="pb-4 border-b border-[#F1F5F4]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription className="mt-0.5">
              Manage your profile details, department affiliation, and contact info
            </CardDescription>
          </div>

          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<EditIcon size={14} />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        {successMessage && (
          <div className="mb-5 p-3 rounded-lg bg-[#DDF4E9] border border-[#22C55E]/40 flex items-center gap-2 text-xs font-medium text-[#063F3F] animate-in fade-in">
            <CheckCircleIcon size={16} className="text-[#22C55E] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] flex items-center gap-2 text-xs font-medium text-[#B91C1C] animate-in fade-in">
            <span className="font-bold">⚠</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <Input
              label="Full Name *"
              id="profile-name"
              value={formData.name}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              errorMessage={errors.name}
            />

            {/* Email Address */}
            <Input
              label="Email Address *"
              id="profile-email"
              type="email"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              errorMessage={errors.email}
              helperText={isEditing ? 'Work account email' : undefined}
            />

            {/* Job Title */}
            <Input
              label="Job Title *"
              id="profile-title"
              value={formData.title || ''}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              errorMessage={errors.title}
              placeholder="e.g. Senior Operations Specialist"
            />

            {/* Department */}
            <Select
              label="Department *"
              id="profile-department"
              value={formData.department}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>

            {/* Phone Number */}
            <Input
              label="Contact Phone"
              id="profile-phone"
              type="tel"
              value={formData.phone || ''}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />

            {/* Timezone */}
            <Select
              label="Active Timezone"
              id="profile-timezone"
              value={formData.timezone || TIMEZONES[0]}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </Select>
          </div>

          {/* Biography */}
          <div className="pt-1">
            <label
              htmlFor="profile-bio"
              className="block text-xs font-semibold text-[#102A2A] mb-1"
            >
              Professional Bio
            </label>
            <textarea
              id="profile-bio"
              rows={3}
              disabled={!isEditing}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Share a brief overview of your functional domain, operational duties, or primary responsibilities..."
              className="w-full text-xs text-[#102A2A] p-2.5 rounded-lg border border-[#CBD5E1] bg-white disabled:bg-[#F3F9F7] disabled:text-[#6B7F7F] focus:outline-none focus:ring-1 focus:ring-[#063F3F] transition-all resize-none"
            />
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#F1F5F4]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSaving}
              >
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
