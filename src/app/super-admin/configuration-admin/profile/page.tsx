'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SubAdminProfileView } from '@/app/wireframe/ui/components/SubAdminProfileView';
import { getConfigAdminById, ConfigAdmin } from '@/lib/services/config-admin-service';
import { ensureIsoDate } from '@/utils/date';

function capitalize(s?: string) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

const mapStatus = (s: string): 'Active' | 'Inactive' | 'Terminated' => {
  if (s === 'ACTIVE') return 'Active';
  if (s === 'INACTIVE') return 'Inactive';
  if (s === 'TERMINATED') return 'Terminated';
  return 'Inactive';
};

function ProfileContent() {
  const searchParams = useSearchParams();
  const adminId = searchParams.get('adminId');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!adminId) {
      setError('Admin ID is missing');
      setLoading(false);
      return;
    }

    getConfigAdminById(adminId)
      .then((admin) => {
        setData({
          name: admin.full_name || admin.username,
          username: admin.username,
          employeeId: `CFG-${admin.id.slice(0, 8).toUpperCase()}`,
          role: 'Configuration Admin',
          status: mapStatus(admin.status),
          avatar: admin.profile_photo || undefined,
          gender: capitalize(admin.gender),
          dateOfBirth: ensureIsoDate(admin.date_of_birth || ''),
          designation: admin.designation || '',
          mobileNumber: admin.mobile_number || '',
          alternateMobileNumber: admin.alternate_mobile || '',
          email: admin.email_address || '',
          remarks: admin.remarks || '',
        });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [adminId]);

  if (loading) {
    return (
      <div className="p-10 text-gray-400 font-medium h-screen flex items-center justify-center animate-pulse">
        Retrieving Administrative Profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500 font-medium h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <SubAdminProfileView
      data={data}
      rawData={data}
      adminId={adminId || undefined}
      onRefresh={() => {}}
      historyPath="/super-admin/configuration-admin/profile/history"
      editPath="/super-admin/configuration-admin/profile/edit"
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
