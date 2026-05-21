'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { SchoolViewProfile } from '@/app/wireframe/ui/components/SchoolViewProfile';

const MOCK_SCHOOL_DATA = {
  id: '1',
  name: 'UBUDDY School',
  uCode: '1210',
  udiseCode: '23010100101',
  schoolCode: 'UB-SCH-001',
  affiliationCode: 'CBSE-987654',
  status: 'Active' as const,
  principalName: 'Dr. Anjali Sharma',
  principalGender: 'Female',
  principalDob: '12/04/1982',
  directorName: 'Mr. Rajesh Kumar',
  directorGender: 'Male',
  directorDob: '25/08/1975',
  address: 'Flat 402, Sunrise Apartments, Sector 15, Dwarka, New Delhi',
  city: 'Indore',
  state: 'Madhya Pradesh',
  email: 'admin@ubuddyschool.com',
  website: 'www.ubuddyschool.com',
  phone: '987-654-3210',
  alternatePhone: '912-345-6789',
  username: 'ubuddy_admin_indore',
  remarks: 'This is a premium institution registered under the UBUDDY program. All modules are currently being managed by the central admin.',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=300&h=300',
  pocs: [
    {
      id: 'p1',
      name: 'Amit Verma',
      gender: 'Male',
      dob: '10/05/1990',
      designation: 'Admin',
      contactNumber: '998-877-6655',
      alternateNumber: '998-877-6644',
      remarks: 'Primary contact for technical queries.'
    },
    {
      id: 'p2',
      name: 'Sneha Gupta',
      gender: 'Female',
      dob: '22/11/1992',
      designation: 'Accounts',
      contactNumber: '991-122-3344',
      alternateNumber: '991-122-3355'
    }
  ]
};

export default function ViewSchoolPage() {
  const params = useParams();
  const schoolId = params.id as string;

  // In a real app, we would fetch data using schoolId
  
  return (
    <SchoolViewProfile data={MOCK_SCHOOL_DATA} />
  );
}
