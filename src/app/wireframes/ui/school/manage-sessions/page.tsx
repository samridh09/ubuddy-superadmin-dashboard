'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolManageSessionsView } from '@/app/wireframe/ui/components/SchoolManageSessionsView';

const MOCK_SESSIONS = [
  { id: '1', academicYear: '2025-2026', startDate: 'Apr 01, 2025', endDate: 'Mar 31, 2026', isLocked: false },
  { id: '2', academicYear: '2024-2025', startDate: 'Apr 01, 2024', endDate: 'Mar 31, 2025', isLocked: true },
];

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
