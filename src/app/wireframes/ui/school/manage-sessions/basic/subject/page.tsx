'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolSubjectView } from '@/app/wireframe/ui/components/SchoolSubjectView';

function SubjectContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';
  const sessionId = searchParams.get('sessionId') || '';

  return (
    <SchoolSubjectView
      schoolName="Nishu International School"
      sessionYear="2025-2026"
      schoolId={schoolId}
      sessionId={sessionId}
    />
  );
}

export default function SubjectPage() {
  return (
    <Suspense>
      <SubjectContent />
    </Suspense>
  );
}
