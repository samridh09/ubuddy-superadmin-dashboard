'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

/**
 * SuperAdminGuard - Component to protect Super-Admin dashboard routes.
 * Redirects to /super-admin/login if not authenticated as SUPER_ADMIN.
 */

export const SuperAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/super-admin/login');
      } else if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'CONFIGURATION_ADMIN') {
        router.replace('/super-admin/login');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Prevent flicker during initial load or while redirecting
  const isAllowedRole = user?.role === 'SUPER_ADMIN' || user?.role === 'CONFIGURATION_ADMIN';
  if (loading || (!isAuthenticated && !loading) || (isAuthenticated && !isAllowedRole)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Verifying Master Access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
