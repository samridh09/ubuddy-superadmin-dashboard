'use client';

import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';

export default function BlankDashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/super-admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-xl text-gray-400">Dashboard (Blank)</h1>
      <button 
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
