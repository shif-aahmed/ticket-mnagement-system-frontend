'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthCardLayout } from '@/components/auth/auth-card-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, EyeIcon, EyeOffIcon, ArrowRightIcon } from '@/components/ui/icons';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!newPassword) {
      errs.new = 'Please enter your new password.';
    } else if (newPassword.length < 8) {
      errs.new = 'Password must be at least 8 characters.';
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
    setIsSuccess(true);
  };

  return (
    <AuthCardLayout
      title="Create new password"
      subtitle="Your new password must be at least 8 characters long."
    >
      {isSuccess ? (
        /* Success State */
        <div className="space-y-5 animate-in fade-in text-left">
          <div className="p-4 rounded-xl bg-[#DDF4E9] border border-[#22C55E]/40 flex items-start gap-3">
            <CheckCircleIcon size={20} className="text-[#22C55E] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-[#063F3F]">
              <h4 className="font-bold">Password Successfully Updated</h4>
              <p className="leading-relaxed">
                Your new password has been verified. You can now sign in with your updated credentials.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/login" className="block w-full">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRightIcon size={14} />}
                className="w-full justify-center h-10 shadow-sm"
              >
                Proceed to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Form State */
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="reset-new-password"
            label="New Password *"
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.new) setErrors({ ...errors, new: '' });
            }}
            placeholder="Minimum 8 characters"
            errorMessage={errors.new}
            required
            autoComplete="new-password"
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

          <Input
            id="reset-confirm-password"
            label="Confirm New Password *"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirm) setErrors({ ...errors, confirm: '' });
            }}
            placeholder="Re-enter new password"
            errorMessage={errors.confirm}
            required
            autoComplete="new-password"
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

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center h-10 shadow-sm"
            >
              Update Password
            </Button>
          </div>

          <div className="text-center pt-1">
            <Link
              href="/login"
              className="text-xs text-[#6B7F7F] hover:text-[#102A2A] transition-colors"
            >
              Cancel and return to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthCardLayout>
  );
}
