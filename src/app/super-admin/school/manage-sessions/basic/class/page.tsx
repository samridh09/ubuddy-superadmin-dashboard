'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolClassSectionView } from '../../../../../wireframe/ui/components/SchoolClassSectionView';

function ClassSectionContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';
  const sessionId = searchParams.get('sessionId') || '';

  return (
    <SchoolClassSectionView
      schoolName="Nishu International School"
      sessionYear="2025-2026"
      schoolId={schoolId}
      sessionId={sessionId}
    />
  );
}

export default function ClassSectionPage() {
  return (
    <Suspense>
      <ClassSectionContent />
    </Suspense>
  );
}
