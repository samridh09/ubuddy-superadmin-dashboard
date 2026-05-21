'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubAdminHistoryView } from '@/app/wireframe/ui/components/SubAdminHistoryView';
import { getConfigAdminHistory } from '@/lib/services/config-admin-service';
import type { HistoryEntry } from '@/types';

function HistoryContent() {
  const searchParams = useSearchParams();
  const adminId = searchParams.get('adminId') ?? '';

  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!adminId) { setLoading(false); return; }
    getConfigAdminHistory(adminId)
      .then(setEntries)
      .catch(() => setError('Failed to load history.'))
      .finally(() => setLoading(false));
  }, [adminId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-10 font-medium text-gray-400 animate-pulse">
        Loading Audit Logs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-10 font-medium text-red-400">
        {error}
      </div>
    );
  }

  return <SubAdminHistoryView entries={entries} />;
}

export default function ConfigurationAdminHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center p-10 font-medium text-gray-400 animate-pulse">
          Loading Audit Logs...
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}
