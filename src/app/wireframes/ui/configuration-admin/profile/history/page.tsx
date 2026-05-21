'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubAdminHistoryView } from '@/app/wireframe/ui/components/SubAdminHistoryView';

const MOCK_HISTORY = [
  {
    id: 'h1',
    action: 'PROFILE_UPDATED',
    changes: [
      { fieldName: 'mobileNumber', oldValue: '0790000000', newValue: '0790324653' },
      { fieldName: 'designation', oldValue: 'Admin', newValue: 'Configuration Admin' },
    ],
    createdAt: '2026-05-04T10:00:00Z',
    performedBy: { id: 'sa-1', name: 'Super Admin' },
  },
  {
    id: 'h2',
    action: 'STATUS_CHANGED',
    changes: [
      { fieldName: 'status', oldValue: 'Inactive', newValue: 'Active' },
    ],
    createdAt: '2026-04-20T09:30:00Z',
    performedBy: { id: 'sa-1', name: 'Super Admin' },
  },
  {
    id: 'h3',
    action: 'CREATED',
    changes: [],
    createdAt: '2026-01-01T10:00:00Z',
    performedBy: { id: 'sa-1', name: 'Super Admin' },
  },
];

function HistoryContent() {
  const searchParams = useSearchParams();
  // adminId available if needed for future API integration
  void searchParams.get('adminId');
  return <SubAdminHistoryView entries={MOCK_HISTORY} />;
}

export default function ConfigurationAdminHistoryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400 font-medium h-screen flex items-center justify-center animate-pulse">Loading Audit Logs...</div>}>
      <HistoryContent />
    </Suspense>
  );
}
