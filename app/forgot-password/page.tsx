'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthCardLayout } from '@/components/auth/auth-card-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, ArrowLeftIcon, ArrowUpRightIcon } from '@/components/ui/icons';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Please enter your work email address.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <AuthCardLayout
      title="Reset your password"
      subtitle="Enter the verified email associated with your TicketGo account to receive recovery instructions."
    >
      {isSubmitted ? (
        /* Success State */
        <div className="space-y-5 animate-in fade-in">
          <div className="p-4 rounded-xl bg-[#DDF4E9] border border-[#22C55E]/40 flex items-start gap-3 text-left">
            <CheckCircleIcon size={20} className="text-[#22C55E] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-[#063F3F]">
              <h4 className="font-bold">Password Reset Link Dispatched</h4>
              <p className="leading-relaxed">
                If an enterprise account exists for <strong className="font-semibold">{email}</strong>, you will receive an email with reset instructions shortly.
              </p>
              <p className="text-[11px] text-[#0F766E] pt-1">
                Note: This is a frontend session demonstration. No remote email was dispatched.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#F3F9F7] rounded-lg border border-[#E5EDE9] text-xs text-left space-y-1.5">
            <span className="font-semibold text-[#102A2A] block">
              Frontend Flow Shortcut
            </span>
            <p className="text-[11px] text-[#6B7F7F]">
              To preview the next step of this flow right now:
            </p>
            <Link
              href="/reset-password"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#063F3F] hover:underline"
            >
              <span>Open Reset Password screen directly</span>
              <ArrowUpRightIcon size={12} />
            </Link>
          </div>

          <div className="pt-2">
            <Link href="/login" className="block w-full">
              <Button
                variant="outline"
                size="md"
                leftIcon={<ArrowLeftIcon size={14} />}
                className="w-full justify-center"
              >
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Form State */
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="forgot-email"
            label="Work Email Address *"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="alex.morgan@ticketgo.io"
            errorMessage={error || undefined}
            required
            autoComplete="email"
          />

          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center h-10 shadow-sm"
            >
              Send Recovery Instructions
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#6B7F7F] hover:text-[#102A2A] transition-colors"
              >
                <ArrowLeftIcon size={13} />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        </form>
      )}
    </AuthCardLayout>
  );
}
