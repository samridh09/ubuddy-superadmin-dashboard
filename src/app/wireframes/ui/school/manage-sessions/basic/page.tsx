'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolBasicConfigView } from '@/app/wireframe/ui/components/SchoolBasicConfigView';

function BasicConfigContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';
  const sessionId = searchParams.get('sessionId') || '';

  return (
    <SchoolBasicConfigView
      schoolName="Nishu International School"
      sessionYear="2025-2026"
      schoolId={schoolId}
      sessionId={sessionId}
    />
  );
}

export default function BasicConfigPage() {
  return (
    <Suspense>
      <BasicConfigContent />
    </Suspense>
  );
}
