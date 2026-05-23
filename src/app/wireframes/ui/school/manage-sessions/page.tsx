'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolManageSessionsView } from '@/app/wireframe/ui/components/SchoolManageSessionsView';

const MOCK_SESSIONS = [
  { id: '1', academicYear: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', isLocked: false },
  { id: '2', academicYear: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31', isLocked: true },
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
