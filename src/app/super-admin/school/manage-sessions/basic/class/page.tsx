'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClassSectionManagementView } from '@/components/super-admin/school/classes/ClassSectionManagementView';
import { getSchoolById } from '@/lib/services/school-service';
import { getSessionById } from '@/lib/services/session-service';

function ClassSectionContent() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') || '';
  const sessionId = searchParams.get('sessionId') || '';
  
  const [schoolName, setSchoolName] = useState('Loading...');
  const [sessionYear, setSessionYear] = useState('...');

  useEffect(() => {
    if (schoolId) {
      getSchoolById(schoolId)
        .then(school => setSchoolName(school.name))
        .catch(err => console.error('Failed to fetch school:', err));
    }
    if (sessionId) {
      getSessionById(sessionId)
        .then(session => setSessionYear(session.name))
        .catch(err => console.error('Failed to fetch session:', err));
    }
  }, [schoolId, sessionId]);

  if (!schoolId || !sessionId) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Missing School ID or Session ID.</p>
      </div>
    );
  }

  return (
    <ClassSectionManagementView
      schoolName={schoolName}
      sessionYear={sessionYear}
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
