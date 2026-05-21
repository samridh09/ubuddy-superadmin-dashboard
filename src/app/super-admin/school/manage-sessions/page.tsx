'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { SchoolManageSessionsView } from '../../../wireframe/ui/components/SchoolManageSessionsView';
import { MOCK_SESSIONS } from '@/mock/school.mock';

function ManageSessionsContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';

  return (
    <SchoolManageSessionsView
      schoolName="Nishu International School"
      initialSessions={MOCK_SESSIONS}
      schoolId={schoolId}
    />
  );
}

export default function ManageSessionsPage() {
  return (
    <Suspense>
      <ManageSessionsContent />
    </Suspense>
  );
}
