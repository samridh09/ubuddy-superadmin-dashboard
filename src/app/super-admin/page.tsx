'use client';

import React from 'react';
import { PageWrapper } from '../wireframe/ui/components/ui';

const SuperAdminDashboard = () => {
  return (
    <PageWrapper>
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-[28px] font-black text-blue-900 tracking-tight text-center">
          Welcome to Super-Admin Dashboard
        </h1>
      </div>
    </PageWrapper>
  );
};

export default SuperAdminDashboard;
