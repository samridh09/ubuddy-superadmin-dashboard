'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SchoolViewProfile } from '../../../../wireframe/ui/components/SchoolViewProfile';
import { getSchoolById } from '@/lib/services/school-service';
import { formatToDisplayDate } from '@/utils/date';

function capitalize(str?: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function ViewSchoolPage() {
  const params = useParams();
  const schoolId = params.id as string;

  const [data, setData] = useState<Parameters<typeof SchoolViewProfile>[0]['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSchoolById(schoolId)
      .then((school) => {
        setData({
          id: school.id,
          name: school.name,
          uCode: school.code,
          udiseCode: school.udise_code,
          schoolCode: school.affiliation_number,
          affiliationCode: school.affiliation_number,
          status: school.status === 'ACTIVE' ? 'Active' : 'Inactive',
          principalName: school.principal_name ?? '',
          principalGender: capitalize(school.principal_gender),
          principalDob: formatToDisplayDate(school.principal_dob ?? ''),
          directorName: school.director_name ?? '',
          directorGender: capitalize(school.director_gender),
          directorDob: formatToDisplayDate(school.director_dob ?? ''),
          address: [school.address.street, school.address.city, school.address.state, school.address.zipCode].filter(Boolean).join(', '),
          city: school.address.city,
          state: school.address.state,
          email: school.email ?? '',
          website: school.website_url ?? '',
          phone: school.contact_number,
          alternatePhone: school.alternative_contact_number ?? '',
          username: '',
          remarks: school.remarks ?? '',
          logoUrl: school.logo_url,
          pocs: (school.pocs ?? []).map((poc) => ({
            id: poc.id,
            name: poc.name,
            gender: capitalize(poc.gender),
            dob: formatToDisplayDate(poc.date_of_birth),
            designation: poc.designation,
            contactNumber: poc.primary_contact_number,
            alternateNumber: poc.alternate_contact_number ?? undefined,
            remarks: poc.remarks,
          })),
        });
      })
      .catch((err) => setError(err.message ?? 'Failed to load school'));
  }, [schoolId]);

  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!data) return (
    <div className="p-8 space-y-6 animate-pulse">
      {/* header bar */}
      <div className="h-8 w-80 bg-gray-100 rounded-xl" />
      {/* profile card */}
      <div className="bg-white rounded-[40px] border border-gray-100 p-10 flex gap-10">
        <div className="w-36 h-36 rounded-[40px] bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-4 py-2">
          <div className="h-8 w-64 bg-gray-100 rounded-lg" />
          <div className="h-4 w-32 bg-gray-100 rounded-lg" />
        </div>
      </div>
      {/* detail sections */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-10 space-y-10">
        {[4, 3, 5, 2].map((cols, si) => (
          <div key={si} className="space-y-4">
            <div className="h-3 w-32 bg-gray-100 rounded" />
            <div className={`grid grid-cols-${Math.min(cols, 4)} gap-8`}>
              {Array.from({ length: cols }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-2.5 w-16 bg-gray-100 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return <SchoolViewProfile data={data} />;
}
