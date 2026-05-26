'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Shield, UserCog, Mail, Lock, Loader2, ChevronLeft } from 'lucide-react';

import { GuestGuard } from '@/components/guest-guard';
import { useAuth } from '@/providers/auth-provider';
import { loginSuperAdmin } from '@/lib/authentication/super-admin';
import type { AuthStep, AdminRole, LoginFields } from '@/types/auth';
import type { UserProfile } from '@/types/user';

const ROLE_CONFIG = {
  SUPER_ADMIN: {
    Icon: Shield,
    title: 'Super Admin Login',
    subtitle: 'Welcome back! Please enter your credentials to access the super admin panel.',
    placeholder: 'superadmin',
  },
  CONFIGURATION_ADMIN: {
    Icon: UserCog,
    title: 'Configuration Admin Login',
    subtitle: 'Welcome back! Please enter your credentials to access the configuration panel.',
    placeholder: 'configadmin',
  },
} as const;

function LoginPageContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<AuthStep>('select');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('SUPER_ADMIN');
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFields>({ mode: 'onChange', defaultValues: { username: '', password: '' } });

  const handlePortalSelect = (role: AdminRole) => {
    setSelectedRole(role);
    setApiError(null);
    reset();
    setStep('login');
  };

  const handleBackToSelect = () => {
    setStep('select');
    setApiError(null);
    reset();
  };

  const onSubmit = async (fields: LoginFields) => {
    setApiError(null);
    try {
      const resp = await loginSuperAdmin(fields.username, fields.password, selectedRole);
      login(resp.data.access_token, resp.data.refresh_token, resp.data.user as UserProfile);
      router.push('/super-admin');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Incorrect username or password');
    }
  };

  const current = ROLE_CONFIG[selectedRole];
  const { Icon: RoleIcon } = current;

  return (
    <div className="relative flex min-h-screen overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
      {/* Full-screen background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/50" />
      </div>

      {/* Left panel */}
      <div className="relative z-20 flex min-h-screen w-full flex-col rounded-r-[50px] bg-white p-8 md:w-1/2 md:p-16 lg:p-24">
        {/* Back nav */}
        <div className="mb-8">
          {step === 'select' ? (
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBackToSelect}
              className="inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Selection
            </button>
          )}
        </div>

        {/* Main content */}
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-md">
            {step === 'select' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="mb-2 font-heading text-3xl font-bold tracking-tight text-neutral-900">
                  Welcome back
                </h1>
                <p className="mb-8 text-neutral-500">Please select your portal to continue.</p>

                <div className="space-y-4">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePortalSelect('SUPER_ADMIN')}
                    onKeyDown={(e) => e.key === 'Enter' && handlePortalSelect('SUPER_ADMIN')}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-[#0F172A]/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100/50">
                        <Shield className="h-6 w-6 text-neutral-700" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Super Admin</p>
                        <p className="text-sm text-neutral-500">Manage schools &amp; system</p>
                      </div>
                    </div>
                    <span className="rounded-lg bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-colors group-hover:bg-neutral-700">
                      Login
                    </span>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePortalSelect('CONFIGURATION_ADMIN')}
                    onKeyDown={(e) => e.key === 'Enter' && handlePortalSelect('CONFIGURATION_ADMIN')}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-[#0F172A]/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100/50">
                        <UserCog className="h-6 w-6 text-neutral-700" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Configuration Admin</p>
                        <p className="text-sm text-neutral-500">Manage global settings</p>
                      </div>
                    </div>
                    <span className="rounded-lg bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-colors group-hover:bg-neutral-700">
                      Login
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Icon + title header */}
                <div className="mb-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-100/50">
                    <RoleIcon className="h-6 w-6 text-neutral-700" />
                  </div>
                  <h1 className="mb-2 font-heading text-3xl font-bold leading-tight tracking-tight text-neutral-900">
                    {current.title}
                  </h1>
                  <p className="text-sm text-neutral-500">{current.subtitle}</p>
                </div>

                {apiError && (
                  <div role="alert" className="mb-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    ⚠️ {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Username
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        autoComplete="username"
                        placeholder={current.placeholder}
                        className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 [&:-webkit-autofill]:![box-shadow:0_0_0_1000px_white_inset] [&:-webkit-autofill]:![-webkit-text-fill-color:#171717]"
                        {...register('username', { required: 'Username is required' })}
                      />
                    </div>
                    {errors.username && (
                      <p className="ml-1 mt-1 text-xs text-red-500">{errors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-neutral-900 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 [&:-webkit-autofill]:![box-shadow:0_0_0_1000px_white_inset] [&:-webkit-autofill]:![-webkit-text-fill-color:#171717]"
                        {...register('password', { required: 'Password is required' })}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      {errors.password ? (
                        <p className="ml-1 text-xs text-red-500">{errors.password.message}</p>
                      ) : (
                        <div />
                      )}
                      <Link
                        href="/super-admin/forgot-password"
                        className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="h-12 w-full rounded-xl bg-neutral-900 font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-neutral-500">
                  System Administrator Access Only
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-xs text-neutral-400">© 2026 Ubuddy Inc.</p>
      </div>

      {/* Right panel — transparent, shows background */}
      <div className="relative z-10 hidden flex-col items-end p-8 md:flex md:w-1/2">
        <Image
          src="/images/core/logo.png"
          alt="Ubuddy"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function SuperAdminLoginPage() {
  return (
    <GuestGuard>
      <Suspense
        fallback={
          <div className="flex min-h-screen" style={{ backgroundColor: '#0F172A' }}>
            <div className="flex w-full items-center justify-center rounded-r-[50px] bg-white p-8 md:w-1/2 md:p-16 lg:p-24">
              <div className="h-[400px] w-full max-w-md animate-pulse rounded-3xl bg-neutral-100" />
            </div>
          </div>
        }
      >
        <LoginPageContent />
      </Suspense>
    </GuestGuard>
  );
}
