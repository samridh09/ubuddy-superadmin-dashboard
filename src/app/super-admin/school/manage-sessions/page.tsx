'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { SessionManagementView } from '@/components/super-admin/school/sessions/SessionManagementView';
import { getSchoolById } from '@/lib/services/school-service';

function ManageSessionsContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';
  const [schoolName, setSchoolName] = useState('Loading...');

  useEffect(() => {
    if (schoolId) {
      getSchoolById(schoolId)
        .then((school) => {
          setSchoolName(school.name);
        })
        .catch((err) => {
          console.error('Failed to fetch school details:', err);
          setSchoolName('Institution');
        });
    }
  }, [schoolId]);

  if (!schoolId) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No School ID provided.</p>
      </div>
    );
  }

  return (
    <SessionManagementView
      schoolName={schoolName}
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
