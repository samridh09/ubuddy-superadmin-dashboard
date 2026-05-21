'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ConfigAdminEditProfileView } from '@/components/configuration-admin/ConfigAdminEditProfileView';
import { getConfigAdminById } from '@/lib/services/config-admin-service';

function EditContent() {
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
        // Convert dd-mm-yyyy to yyyy-mm-dd for DateInput component
        let isoDOB = '';
        if (admin.date_of_birth && admin.date_of_birth.includes('-')) {
          const parts = admin.date_of_birth.split('-');
          if (parts.length === 3) {
            if (parts[0].length === 4) {
              isoDOB = admin.date_of_birth; // Already ISO
            } else {
              isoDOB = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
          }
        }

        setData({
          name: admin.full_name || admin.username,
          username: admin.username,
          gender: admin.gender,
          dateOfBirth: isoDOB,
          designation: admin.designation || '',
          mobileNumber: admin.mobile_number || '',
          alternateMobileNumber: admin.alternate_mobile || '',
          email: admin.email_address || '',
          remarks: admin.remarks || '',
          status: admin.status === 'ACTIVE' ? 'Active' : admin.status === 'TERMINATED' ? 'Terminated' : 'Inactive',
          avatar: admin.profile_photo || undefined,
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
        Loading...
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

  return <ConfigAdminEditProfileView data={data} adminId={adminId!} />;
}

export default function ConfigurationAdminEditProfilePage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400 font-medium h-screen flex items-center justify-center animate-pulse">Loading...</div>}>
      <EditContent />
    </Suspense>
  );
}
