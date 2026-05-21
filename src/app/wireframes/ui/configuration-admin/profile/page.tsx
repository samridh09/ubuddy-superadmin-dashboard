'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubAdminProfileView } from '@/app/wireframe/ui/components/SubAdminProfileView';

const MOCK_PROFILES: Record<string, any> = {
  '1': { name: 'SAMRIDH SATNALIKA', username: 'samridh', employeeId: 'CFG-001', role: 'Configuration Admin', status: 'Active' as const, gender: 'Male', dateOfBirth: '1995-05-04', designation: 'Configuration Admin', mobileNumber: '0790324653', alternateMobileNumber: '', email: 'samridh@ubuddy.in', remarks: '' },
  '2': { name: 'ANISHA GUPTA', username: 'anisha', employeeId: 'CFG-002', role: 'Configuration Admin', status: 'Active' as const, gender: 'Female', dateOfBirth: '1993-08-12', designation: 'Configuration Admin', mobileNumber: '0987654321', alternateMobileNumber: '', email: 'anisha@ubuddy.in', remarks: '' },
  '3': { name: 'ROHAN MEHTA', username: 'rohan', employeeId: 'CFG-003', role: 'Configuration Admin', status: 'Inactive' as const, gender: 'Male', dateOfBirth: '1991-03-22', designation: 'Configuration Admin', mobileNumber: '0112233445', alternateMobileNumber: '', email: 'rohan@ubuddy.in', remarks: '' },
  '4': { name: 'PRIYA SHARMA', username: 'priya', employeeId: 'CFG-004', role: 'Configuration Admin', status: 'Terminated' as const, gender: 'Female', dateOfBirth: '1992-11-08', designation: 'Configuration Admin', mobileNumber: '0556677889', alternateMobileNumber: '', email: 'priya@ubuddy.in', remarks: '' },
  '5': { name: 'VIKRAM SINGH', username: 'vikram', employeeId: 'CFG-005', role: 'Configuration Admin', status: 'Active' as const, gender: 'Male', dateOfBirth: '1990-07-19', designation: 'Configuration Admin', mobileNumber: '0443322110', alternateMobileNumber: '', email: 'vikram@ubuddy.in', remarks: '' },
};

function ProfileContent() {
  const searchParams = useSearchParams();
  const adminId = searchParams.get('adminId') ?? '1';
  const profile = MOCK_PROFILES[adminId] ?? MOCK_PROFILES['1'];

  return (
    <SubAdminProfileView
      data={profile}
      rawData={profile}
      adminId={adminId}
      onRefresh={() => {}}
      historyPath="/wireframes/ui/configuration-admin/profile/history"
      editPath="/wireframes/ui/configuration-admin/profile/edit"
    />
  );
}

export default function ConfigurationAdminProfilePage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400 font-medium h-screen flex items-center justify-center animate-pulse">Retrieving Administrative Profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
