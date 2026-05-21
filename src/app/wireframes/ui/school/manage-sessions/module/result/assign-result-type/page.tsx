'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolAssignResultTypeView } from '@/app/wireframe/ui/components/SchoolAssignResultTypeView';

function AssignResultTypeContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';
  const sessionId = searchParams.get('sessionId') || '';

  return (
    <SchoolAssignResultTypeView
      schoolName="Nishu International School"
      schoolId={schoolId}
      sessionId={sessionId}
    />
  );
}

export default function AssignResultTypePage() {
  return (
    <Suspense>
      <AssignResultTypeContent />
    </Suspense>
  );
}
