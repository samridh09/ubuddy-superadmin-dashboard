'use client';

import React, { Suspense } from 'react';
import { ConfigAdminCreateView } from '@/components/configuration-admin/ConfigAdminCreateView';

export default function ConfigurationAdminCreatePage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400 font-medium h-screen flex items-center justify-center animate-pulse">Loading...</div>}>
      <ConfigAdminCreateView />
    </Suspense>
  );
}
