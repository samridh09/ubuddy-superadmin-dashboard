import type { SchoolPOCFormData, SchoolSession } from '@/types/school';

interface MockSchoolEntry {
  label: string;
  data: {
    schoolName: string;
    email: string;
    udiseCode: string;
    affiliationCode: string;
    principalName: string;
    principalGender: string;
    directorName: string;
    directorGender: string;
    state: string;
    city: string;
    address: string;
    website: string;
    phone: string;
    altPhone: string;
    default_admin_username: string;
    remarks: string;
  };
  pocs: Omit<SchoolPOCFormData, 'id'>[];
}

export const MOCK_SCHOOLS: MockSchoolEntry[] = [
  {
    label: 'Greenwood High',
    data: {
      schoolName: 'Greenwood International High',
      email: 'samridhsatnalika790@gmail.com',
      udiseCode: '12345678901',
      affiliationCode: '1234567',
      principalName: 'Dr. Sarah Mitchell',
      principalGender: 'FEMALE',
      directorName: 'James Wilson',
      directorGender: 'MALE',
      state: 'Maharashtra',
      city: 'Mumbai',
      address: '123 Education Lane, Powai',
      website: 'https://www.greenwood.edu',
      phone: '987-654-3210',
      altPhone: '987-654-3211',
      default_admin_username: 'greenwoodsa',
      remarks: 'Top rated international school.',
    },
    pocs: [
      {
        name: 'Alice Smith',
        gender: 'FEMALE',
        designation: 'Admin Head',
        contactNumber: '999-888-7777',
        alternateNumber: '999-888-7778',
        remarks: 'Primary contact',
        dob: '1990-01-01',
      },
    ],
  },
  {
    label: 'Delhi Public School',
    data: {
      schoolName: 'Delhi Public School Sector-4',
      email: 'samrockerislive04@gmail.com',
      udiseCode: '09876543210',
      affiliationCode: '2233445',
      principalName: 'Mr. R.K. Sharma',
      principalGender: 'MALE',
      directorName: 'S.K. Gupta',
      directorGender: 'MALE',
      state: 'Delhi',
      city: 'New Delhi',
      address: 'Sector Four R.K. Puram',
      website: 'https://www.dpsrkp.net',
      phone: '911-222-3333',
      altPhone: '',
      default_admin_username: 'dpsrkpsa',
      remarks: 'Central city branch.',
    },
    pocs: [
      {
        name: 'Robert Brown',
        gender: 'MALE',
        designation: 'Coordinator',
        contactNumber: '911-555-6666',
        alternateNumber: '',
        remarks: 'Secondary contact',
        dob: '1985-03-12',
      },
    ],
  },
  {
    label: 'Minimal School',
    data: {
      schoolName: 'Public Elementary School',
      email: 'samrockerstream20@gmail.com',
      udiseCode: '',
      affiliationCode: '',
      principalName: '',
      principalGender: 'MALE',
      directorName: '',
      directorGender: 'MALE',
      state: 'Karnataka',
      city: 'Bangalore',
      address: 'Main Road Block Five',
      website: '',
      phone: '888-777-6666',
      altPhone: '',
      default_admin_username: 'minimalsa',
      remarks: '',
    },
    pocs: [
      {
        name: 'John Doe',
        gender: 'MALE',
        designation: 'Admin',
        contactNumber: '888-777-6666',
        alternateNumber: '',
        remarks: '',
        dob: '1970-01-01',
      },
    ],
  },
];

export const MOCK_SESSIONS: SchoolSession[] = [
  { id: '1', academicYear: '2025-2026', startDate: 'Apr 01, 2025', endDate: 'Mar 31, 2026', isLocked: false },
  { id: '2', academicYear: '2024-2025', startDate: 'Apr 01, 2024', endDate: 'Mar 31, 2025', isLocked: true },
];
