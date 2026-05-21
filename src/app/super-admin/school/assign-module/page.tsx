'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SchoolAssignModuleView } from '../../../wireframe/ui/components/SchoolAssignModuleView';
import { getSchoolById, getSchoolModules, updateSchoolModules } from '@/lib/services/school-service';
import { DataTable, Table, THead, TBody, Th, SkeletonTableRows } from '@/components/ui/DataTablePrimitives';
import { PageWrapper } from '../../../wireframe/ui/components/ui';

export default function AssignModulePage() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId') ?? '';

  const [schoolName, setSchoolName] = useState('School');
  const [initialData, setInitialData] = useState<{ key: string; name: string; isAssigned: boolean; isDefault: boolean }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    Promise.all([getSchoolModules(), getSchoolById(schoolId)])
      .then(([modulesRes, school]) => {
        setSchoolName(school.name);
        const assigned = new Set(school.assigned_modules ?? []);
        const defaults = new Set(modulesRes.defaults ?? []);
        setInitialData(
          modulesRes.modules.map((m) => ({
            key: m.key,
            name: m.name,
            isAssigned: assigned.has(m.key),
            isDefault: defaults.has(m.key),
          }))
        );
      })
      .catch((err) => setError(err.message || 'Failed to load module data.'));
  }, [schoolId]);

  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!initialData) return (
    <PageWrapper>
      <div className="h-10 w-72 bg-gray-100 rounded-xl animate-pulse mb-6" />
      <DataTable>
        <Table>
          <THead>
            <Th width="w-[120px]" isFirst>S. No.</Th>
            <Th width="w-[450px]">Module Name</Th>
            <Th align="center" width="w-[180px]">Status</Th>
            <Th className="w-full"></Th>
          </THead>
          <TBody>
            <SkeletonTableRows rows={13} cols={[30, 70, 50, 0]} />
          </TBody>
        </Table>
      </DataTable>
    </PageWrapper>
  );

  return (
    <SchoolAssignModuleView
      schoolName={schoolName}
      initialData={initialData}
      schoolId={schoolId}
      onSave={(assignedKeys) => updateSchoolModules(schoolId, assignedKeys).then(() => undefined)}
    />
  );
}
