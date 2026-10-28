'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCardLayout } from '@/components/auth/auth-card-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon, AlertCircleIcon } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('alex.morgan@ticketgo.io');
  const [password, setPassword] = useState('TicketGo2024!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your work email address.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('TicketGo2024!');
    setError(null);
  };

  return (
    <AuthCardLayout
      title="Sign in to your account"
      subtitle="Enter your enterprise credentials to access your ticket queue and workspace."
    >
      {/* Quick Demo Credentials Bar */}
      <div className="p-3 rounded-xl bg-[#F3F9F7] border border-[#E5EDE9] space-y-2">
        <span className="text-[10px] uppercase font-bold text-[#063F3F] tracking-wide block">
          Quick Demo Accounts (Click to Fill)
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => fillDemoUser('alex.morgan@ticketgo.io')}
            className="px-2 py-1 text-[11px] font-semibold bg-white border border-[#CBD5E1] rounded hover:border-[#064747] text-[#102A2A] transition-colors cursor-pointer"
          >
            Admin (Alex)
          </button>
          <button
            type="button"
            onClick={() => fillDemoUser('liam.chen@ticketgo.io')}
            className="px-2 py-1 text-[11px] font-semibold bg-white border border-[#CBD5E1] rounded hover:border-[#064747] text-[#102A2A] transition-colors cursor-pointer"
          >
            Agent (Liam)
          </button>
          <button
            type="button"
            onClick={() => fillDemoUser('marcus.vance@ticketgo.io')}
            className="px-2 py-1 text-[11px] font-semibold bg-white border border-[#CBD5E1] rounded hover:border-[#064747] text-[#102A2A] transition-colors cursor-pointer"
          >
            Employee (Marcus)
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#EF4444]/30 flex items-center gap-2 text-xs font-medium text-[#DC2626] animate-in fade-in">
          <AlertCircleIcon size={16} className="shrink-0 text-[#EF4444]" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="login-email"
          label="Work Email Address *"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="name@ticketgo.io"
          autoComplete="email"
          required
        />

        <div>
          <Input
            id="login-password"
            label="Password *"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="••••••••••••"
            autoComplete="current-password"
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#6B7F7F] hover:text-[#102A2A] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            }
          />
        </div>

        {/* Remember me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[#475569]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[#CBD5E1] text-[#064747] accent-[#064747]"
            />
            <span>Remember this device</span>
          </label>

          <Link
            href="/forgot-password"
            className="font-medium text-[#063F3F] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="w-full justify-center text-sm font-semibold h-10 shadow-sm"
          >
            {isLoading ? 'Signing In...' : 'Sign In to Workspace'}
          </Button>
        </div>
      </form>
    </AuthCardLayout>
  );
}
