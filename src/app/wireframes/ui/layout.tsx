'use client';

import React from 'react';
import SuperAdminSidebar from '@/components/SuperAdminSidebar';

export default function WireframesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex overflow-hidden font-sans text-neutral-900">
      <SuperAdminSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        <div className="flex-1 overflow-y-auto bg-[#F1F5F9] p-4 sm:p-10 border-none scrollbar-custom">
          <div className="w-full space-y-8">
            {children}
            <div className="h-48"></div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        .scrollbar-custom::-webkit-scrollbar { width: 12px; height: 12px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.01); }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.25); border-radius: 20px; border: 3px solid transparent; background-clip: content-box; }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.35); }
      `}</style>
    </div>
  );
}
