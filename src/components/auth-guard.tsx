'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

/**
 * AuthGuard - Component to protect private routes.
 * Redirects to /school/login if not authenticated.
 */

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/school/login');
      } else if (user?.password_reset_required) {
        const email = user.profile?.email || '';
        const tab = user.role === 'SCHOOL_SUB_ADMIN' ? 'subadmin' : '';
        router.replace(`/school/forgot-password?required=true&email=${encodeURIComponent(email)}&tab=${tab}`);
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Prevent flicker during initial load or while redirecting
  if (loading || (!isAuthenticated && !loading) || (isAuthenticated && user?.password_reset_required)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Securing Session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
