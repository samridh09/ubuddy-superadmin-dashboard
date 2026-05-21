'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolMarkingPatternView } from '@/app/wireframe/ui/components/SchoolMarkingPatternView';

function MarkingPatternContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';
  const sessionId = searchParams.get('sessionId') || '';

  return (
    <SchoolMarkingPatternView
      schoolName="Nishu International School"
      schoolId={schoolId}
      sessionId={sessionId}
    />
  );
}

export default function MarkingPatternPage() {
  return (
    <Suspense>
      <MarkingPatternContent />
    </Suspense>
  );
}
