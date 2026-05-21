'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolResultConfigView } from '../../../../../wireframe/ui/components/SchoolResultConfigView';

function ResultConfigContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';
  const sessionId = searchParams.get('sessionId') || '';

  return (
    <SchoolResultConfigView
      schoolName="Nishu International School"
      sessionYear="2025-2026"
      schoolId={schoolId}
      sessionId={sessionId}
    />
  );
}

export default function ResultConfigPage() {
  return (
    <Suspense>
      <ResultConfigContent />
    </Suspense>
  );
}
