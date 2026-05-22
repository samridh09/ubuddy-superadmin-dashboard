'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolConfigureView } from '@/app/wireframe/ui/components/SchoolConfigureView';

function ConfigureContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';
  const sessionId = searchParams.get('sessionId') || '';
  const isView = searchParams.get('view') === 'true';

  return (
    <SchoolConfigureView
      schoolName="Nishu International School"
      sessionYear="2025-2026"
      schoolId={schoolId}
      sessionId={sessionId}
      isViewMode={isView}
    />
  );
}

export default function ConfigurePage() {
  return (
    <Suspense>
      <ConfigureContent />
    </Suspense>
  );
}
