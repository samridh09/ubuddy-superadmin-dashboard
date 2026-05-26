'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ChevronLeft, Shield, KeyRound, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { GuestGuard } from '@/components/guest-guard';
import { forgotPassword, verifyOtp, resetPassword } from '@/lib/authentication/super-admin-auth';

type Step = 'email' | 'otp' | 'reset' | 'success';

function ForgotPasswordContent() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Forms
  const { register: registerEmail, handleSubmit: handleSubmitEmail, formState: { errors: emailErrors, isSubmitting: isSubmittingEmail, isValid: isEmailValid } } = useForm({ mode: 'onChange' });
  const { register: registerOtp, handleSubmit: handleSubmitOtp, formState: { errors: otpErrors, isSubmitting: isSubmittingOtp, isValid: isOtpValid } } = useForm({ mode: 'onChange' });
  const { register: registerReset, handleSubmit: handleSubmitReset, watch, formState: { errors: resetErrors, isSubmitting: isSubmittingReset, isValid: isResetValid } } = useForm({ mode: 'onChange' });

  const onEmailSubmit = async (data: any) => {
    setApiError(null);
    try {
      await forgotPassword(data.email, 'superadmin');
      setEmail(data.email);
      setStep('otp');
    } catch (err: any) {
      setApiError(err.message || 'Failed to send OTP.');
    }
  };

  const onOtpSubmit = async (data: any) => {
    setApiError(null);
    try {
      await verifyOtp(email, data.otp, 'superadmin');
      setOtp(data.otp);
      setStep('reset');
    } catch (err: any) {
      setApiError(err.message || 'Invalid OTP.');
    }
  };

  const onResetSubmit = async (data: any) => {
    setApiError(null);
    try {
      await resetPassword(email, otp, data.password, 'superadmin');
      setStep('success');
    } catch (err: any) {
      setApiError(err.message || 'Failed to reset password.');
    }
  };

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
          <Link
            href="/super-admin/login"
            className="inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        {/* Main content */}
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-md">
            {apiError && (
              <div role="alert" className="mb-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                ⚠️ {apiError}
              </div>
            )}

            {step === 'email' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <div className="mb-4 flex h-12 l-12 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-100/50">
                    <Shield className="h-6 w-6 text-neutral-700" />
                  </div>
                  <h1 className="mb-2 font-heading text-3xl font-bold leading-tight tracking-tight text-neutral-900">
                    Forgot Password
                  </h1>
                  <p className="text-sm text-neutral-500">Enter your email address to receive a one-time password (OTP).</p>
                </div>

                <form onSubmit={handleSubmitEmail(onEmailSubmit)} className="space-y-4" noValidate>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">Email Address</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        placeholder="admin@example.com"
                        className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        {...registerEmail('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' } })}
                      />
                    </div>
                    {emailErrors.email && (
                      <p className="ml-1 mt-1 text-xs text-red-500">{emailErrors.email.message as string}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingEmail || !isEmailValid}
                    className="h-12 w-full rounded-xl bg-neutral-900 font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmittingEmail ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                      </span>
                    ) : 'Send OTP'}
                  </button>
                </form>
              </div>
            )}

            {step === 'otp' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-100/50">
                    <KeyRound className="h-6 w-6 text-neutral-700" />
                  </div>
                  <h1 className="mb-2 font-heading text-3xl font-bold leading-tight tracking-tight text-neutral-900">
                    Verify OTP
                  </h1>
                  <p className="text-sm text-neutral-500">Enter the 6-digit code sent to <span className="font-semibold text-neutral-900">{email}</span></p>
                </div>

                <form onSubmit={handleSubmitOtp(onOtpSubmit)} className="space-y-4" noValidate>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">One-Time Password</label>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-center tracking-[0.5em] text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono text-lg"
                        {...registerOtp('otp', { required: 'OTP is required', minLength: { value: 6, message: 'OTP must be 6 digits' } })}
                      />
                    </div>
                    {otpErrors.otp && (
                      <p className="ml-1 mt-1 text-xs text-red-500">{otpErrors.otp.message as string}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingOtp || !isOtpValid}
                    className="h-12 w-full rounded-xl bg-neutral-900 font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmittingOtp ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                      </span>
                    ) : 'Verify OTP'}
                  </button>
                  <p className="mt-4 text-center text-sm text-neutral-500">
                    Didn't receive code? <button type="button" onClick={() => setStep('email')} className="font-medium text-blue-600 hover:text-blue-500">Resend</button>
                  </p>
                </form>
              </div>
            )}

            {step === 'reset' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-100/50">
                    <Lock className="h-6 w-6 text-neutral-700" />
                  </div>
                  <h1 className="mb-2 font-heading text-3xl font-bold leading-tight tracking-tight text-neutral-900">
                    Set New Password
                  </h1>
                  <p className="text-sm text-neutral-500">Please create a new password for your account.</p>
                </div>

                <form onSubmit={handleSubmitReset(onResetSubmit)} className="space-y-4" noValidate>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">New Password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        {...registerReset('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                      />
                    </div>
                    {resetErrors.password && (
                      <p className="ml-1 mt-1 text-xs text-red-500">{resetErrors.password.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        {...registerReset('confirmPassword', { 
                          required: 'Please confirm your password',
                          validate: (val) => val === watch('password') || 'Passwords do not match'
                        })}
                      />
                    </div>
                    {resetErrors.confirmPassword && (
                      <p className="ml-1 mt-1 text-xs text-red-500">{resetErrors.confirmPassword.message as string}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReset || !isResetValid}
                    className="h-12 w-full rounded-xl bg-neutral-900 font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmittingReset ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Resetting...
                      </span>
                    ) : 'Reset Password'}
                  </button>
                </form>
              </div>
            )}

            {step === 'success' && (
              <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100/50">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                </div>
                <h1 className="mb-4 font-heading text-3xl font-bold leading-tight tracking-tight text-neutral-900">
                  Password Reset!
                </h1>
                <p className="mb-8 text-neutral-500">Your password has been successfully reset. You can now log in with your new password.</p>
                <Link
                  href="/super-admin/login"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  Return to Login
                </Link>
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

export default function ForgotPasswordPage() {
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
        <ForgotPasswordContent />
      </Suspense>
    </GuestGuard>
  );
}
