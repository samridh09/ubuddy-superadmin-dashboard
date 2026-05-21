'use client';

import React, { Suspense } from 'react';
import { SubAdminCreateView } from '@/app/wireframe/ui/components/SubAdminCreateView';

export default function ConfigurationAdminCreatePage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400 font-medium h-screen flex items-center justify-center animate-pulse">Loading...</div>}>
      <SubAdminCreateView />
    </Suspense>
  );
}
