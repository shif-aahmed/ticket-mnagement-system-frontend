'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircleIcon, EyeIcon, EyeOffIcon, LockIcon } from '@/components/ui/icons';

export const SettingsSecuritySection = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!currentPassword) {
      errs.current = 'Please enter your current password.';
    }
    if (!newPassword) {
      errs.new = 'Please enter a new password.';
    } else if (newPassword.length < 8) {
      errs.new = 'Password must be at least 8 characters long.';
    }
    if (newPassword !== confirmPassword) {
      errs.confirm = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSuccessMessage('Password updated successfully (Local session demonstration).');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMessage(null), 4500);
  };

  return (
    <Card className="border-[#E5EDE9] bg-white text-left">
      <CardHeader className="pb-4 border-b border-[#F1F5F4]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#F3F9F7] text-[#063F3F]">
            <LockIcon size={16} />
          </div>
          <div>
            <CardTitle>Security & Password</CardTitle>
            <CardDescription className="mt-0.5">
              Manage your account password and security authentication preferences
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Mock/UI Notice Banner */}
        <div className="p-3 bg-[#F3F9F7] border border-[#CBD5E1] rounded-lg text-xs text-[#374949] space-y-1">
          <strong className="font-semibold text-[#063F3F] block">
            Frontend Demonstration Notice
          </strong>
          <p className="text-[#6B7F7F] text-[11px] leading-relaxed">
            This is a frontend demonstration application. Password changing is UI-only; no password data is persisted or sent to an external authentication server.
          </p>
        </div>

        {successMessage && (
          <div className="p-3 rounded-lg bg-[#DDF4E9] border border-[#22C55E]/40 flex items-center gap-2 text-xs font-medium text-[#063F3F] animate-in fade-in">
            <CheckCircleIcon size={16} className="text-[#22C55E] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          {/* Current Password */}
          <div>
            <Input
              id="settings-current-password"
              label="Current Password *"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (errors.current) setErrors({ ...errors, current: '' });
              }}
              errorMessage={errors.current}
              placeholder="Enter existing password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-[#6B7F7F] hover:text-[#102A2A] cursor-pointer"
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              }
            />
          </div>

          {/* New Password */}
          <div>
            <Input
              id="settings-new-password"
              label="New Password *"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.new) setErrors({ ...errors, new: '' });
              }}
              errorMessage={errors.new}
              placeholder="Minimum 8 characters"
              helperText="Must contain at least 8 characters with letters and numbers"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-[#6B7F7F] hover:text-[#102A2A] cursor-pointer"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              }
            />
          </div>

          {/* Confirm Password */}
          <div>
            <Input
              id="settings-confirm-password"
              label="Confirm New Password *"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirm) setErrors({ ...errors, confirm: '' });
              }}
              errorMessage={errors.confirm}
              placeholder="Re-type new password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-[#6B7F7F] hover:text-[#102A2A] cursor-pointer"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              }
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="sm">
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
