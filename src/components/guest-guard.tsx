'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

/**
 * GuestGuard - Component to protect guest-only routes (like login).
 * Redirects to dashboard if already authenticated.
 */
export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const role = user?.role;
      if (role === 'SUPER_ADMIN' || role === 'CONFIGURATION_ADMIN') {
        router.replace('/super-admin');
      } else {
        router.replace('/dashboard/schooladmin');
      }
    }
  }, [isAuthenticated, loading, router, user]);

  // Show nothing while loading to prevent flicker
  if (loading || isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
