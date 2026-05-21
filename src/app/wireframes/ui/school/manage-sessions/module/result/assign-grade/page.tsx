'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolGradeConfigView } from '@/app/wireframe/ui/components/SchoolGradeConfigView';

function AssignGradeContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';
  const sessionId = searchParams.get('sessionId') || '';

  return (
    <SchoolGradeConfigView
      schoolName="Nishu International School"
      sessionYear="2025-2026"
      schoolId={schoolId}
      sessionId={sessionId}
    />
  );
}

export default function AssignGradePage() {
  return (
    <Suspense>
      <AssignGradeContent />
    </Suspense>
  );
}
