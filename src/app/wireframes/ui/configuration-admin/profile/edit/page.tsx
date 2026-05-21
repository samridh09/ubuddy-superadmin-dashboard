'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubAdminEditProfileView } from '@/app/wireframe/ui/components/SubAdminEditProfileView';

const MOCK_PROFILES: Record<string, any> = {
  '1': { name: 'SAMRIDH SATNALIKA', username: 'samridh', gender: 'Male', dateOfBirth: '1995-05-04', designation: 'Configuration Admin', mobileNumber: '0790324653', alternateMobileNumber: '', email: 'samridh@ubuddy.in', remarks: '', status: 'Active' },
  '2': { name: 'ANISHA GUPTA', username: 'anisha', gender: 'Female', dateOfBirth: '1993-08-12', designation: 'Configuration Admin', mobileNumber: '0987654321', alternateMobileNumber: '', email: 'anisha@ubuddy.in', remarks: '', status: 'Active' },
  '3': { name: 'ROHAN MEHTA', username: 'rohan', gender: 'Male', dateOfBirth: '1991-03-22', designation: 'Configuration Admin', mobileNumber: '0112233445', alternateMobileNumber: '', email: 'rohan@ubuddy.in', remarks: '', status: 'Inactive' },
  '4': { name: 'PRIYA SHARMA', username: 'priya', gender: 'Female', dateOfBirth: '1992-11-08', designation: 'Configuration Admin', mobileNumber: '0556677889', alternateMobileNumber: '', email: 'priya@ubuddy.in', remarks: '', status: 'Terminated' },
  '5': { name: 'VIKRAM SINGH', username: 'vikram', gender: 'Male', dateOfBirth: '1990-07-19', designation: 'Configuration Admin', mobileNumber: '0443322110', alternateMobileNumber: '', email: 'vikram@ubuddy.in', remarks: '', status: 'Active' },
};

function EditContent() {
  const searchParams = useSearchParams();
  const adminId = searchParams.get('adminId') ?? '1';
  const data = MOCK_PROFILES[adminId] ?? MOCK_PROFILES['1'];

  return <SubAdminEditProfileView data={data} adminId={adminId} />;
}

export default function ConfigurationAdminEditProfilePage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400 font-medium h-screen flex items-center justify-center animate-pulse">Loading...</div>}>
      <EditContent />
    </Suspense>
  );
}
