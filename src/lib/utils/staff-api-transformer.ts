import type { Staff, StaffStatus } from '@/types/staff';

/**
 * API Response interface matching the actual backend structure
 */
interface ApiStaffResponse {
  id: string;
  username: string;
  employee_id: string;
  role: string;
  school_id: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | string;
  module_permissions?: Record<string, string[]>;
  last_login?: string;
  profile: {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    user_id?: string;
    name: string;
    mobileNumber: string;
    gender?: 'MALE' | 'FEMALE' | string;
    aadhaarNumber?: string | null;
    panNumber?: string | null;
    dateOfBirth?: string | null;
    maritalStatus?: 'SINGLE' | 'MARRIED' | 'WIDOWED' | 'DIVORCED' | 'SEPARATED' | string | null;
    alternateMobileNumber?: string | null;
    emergencyContact?: string | null;
    address?: string | null;
    email: string;
    fatherName?: string | null;
    motherName?: string | null;
    dateOfJoining?: string | null;
    bankDetails?: string | null;
    designation?: string | null;
    experience?: string | null;
    qualification?: string | null;
    staffType: 'TEACHING' | 'NON_TEACHING' | string;
    remarks?: string | null;
  } | null;
  files?: {
    id?: string;
    profileImageUrl?: string | null;
    aadhaarUrl?: string | null;
    panUrl?: string | null;
    bankChequeUrl?: string | null;
    bankPassbookUrl?: string | null;
    x_marksheetUrl?: string | null;
    xii_marksheetUrl?: string | null;
    graduation_marksheetUrl?: string | null;
    pg_marksheetUrl?: string | null;
    resumeUrl?: string | null;
  };
}

const statusMap: Record<string, StaffStatus> = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  TERMINATED: 'TERMINATED',
};

function normalizeStatus(status?: string | null): StaffStatus {
  if (!status) return 'ACTIVE';
  return statusMap[status.toUpperCase()] || 'ACTIVE';
}

/**
 * Transform API response to frontend Staff type
 */
export function transformApiStaffToStaff(apiStaff: ApiStaffResponse): Staff {
  const profile = apiStaff.profile ?? {
    name: apiStaff.username || apiStaff.employee_id || 'Unknown Staff',
    mobileNumber: '',
    email: '',
    staffType: 'TEACHING',
  };
  const files = apiStaff.files;
  const normalizedProfile = profile as NonNullable<ApiStaffResponse['profile']>;
  
  // Convert UPPERCASE enums to Title Case
  const genderMap = { 'MALE': 'Male', 'FEMALE': 'Female' } as const;
  const maritalStatusMap = {
    'SINGLE': 'Single',
    'MARRIED': 'Married',
    'WIDOWED': 'Widowed',
    'DIVORCED': 'Divorced',
    'SEPARATED': 'Separated'
  } as const;
  const staffTypeMap = {
    'TEACHING': 'Teaching',
    'NON_TEACHING': 'Non-Teaching'
  } as const;

  // Parse emergencyContact if it's a JSON string
  let emergencyContact = undefined;
  if (normalizedProfile.emergencyContact && typeof normalizedProfile.emergencyContact === 'string' && normalizedProfile.emergencyContact.startsWith('{')) {
    try {
      emergencyContact = JSON.parse(normalizedProfile.emergencyContact);
    } catch {
      // If parsing fails, leave it undefined
    }
  }

  // Parse bankDetails if it's a JSON string
  let bankDetails = undefined;
  if (normalizedProfile.bankDetails && typeof normalizedProfile.bankDetails === 'string' && normalizedProfile.bankDetails.startsWith('{')) {
    try {
      bankDetails = JSON.parse(normalizedProfile.bankDetails);
    } catch {
      // If parsing fails, leave it undefined
    }
  }

  // Fallback for missing dates
  const now = new Date().toISOString();
  const createdAt = normalizedProfile.createdAt || apiStaff.last_login || now;
  const updatedAt = normalizedProfile.updatedAt || apiStaff.last_login || now;

  return {
    id: apiStaff.id,
    username: apiStaff.username,
    employeeId: apiStaff.employee_id,
    name: normalizedProfile.name,
    gender: (normalizedProfile.gender ? (genderMap[normalizedProfile.gender.toUpperCase() as keyof typeof genderMap] || 'Male') : 'Male') as any,
    mobileNumber: normalizedProfile.mobileNumber,
    email: normalizedProfile.email,
    staffType: (normalizedProfile.staffType ? (staffTypeMap[normalizedProfile.staffType.toUpperCase() as keyof typeof staffTypeMap] || 'Teaching') : 'Teaching') as any,
    dob: normalizedProfile.dateOfBirth || undefined,
    maritalStatus: normalizedProfile.maritalStatus ? (maritalStatusMap[normalizedProfile.maritalStatus.toUpperCase() as keyof typeof maritalStatusMap] || undefined) : undefined,
    alternateMobileNumber: normalizedProfile.alternateMobileNumber || undefined,
    emergencyContact,
    address: normalizedProfile.address || undefined,
    dateOfJoining: normalizedProfile.dateOfJoining || undefined,
    remarks: normalizedProfile.remarks || undefined,
    motherName: normalizedProfile.motherName || undefined,
    fatherName: normalizedProfile.fatherName || undefined,
    aadhaarNumber: normalizedProfile.aadhaarNumber || undefined,
    panNumber: normalizedProfile.panNumber || undefined,
    bankDetails,
    designation: normalizedProfile.designation || undefined,
    experience: normalizedProfile.experience || undefined,
    qualification: normalizedProfile.qualification || undefined,
    profileImageUrl: files?.profileImageUrl || undefined,
    aadhaarUrl: files?.aadhaarUrl || undefined,
    panUrl: files?.panUrl || undefined,
    bankChequeUrl: files?.bankChequeUrl || undefined,
    bankPassbookUrl: files?.bankPassbookUrl || undefined,
    x_marksheetUrl: files?.x_marksheetUrl || undefined,
    xii_marksheetUrl: files?.xii_marksheetUrl || undefined,
    graduation_marksheetUrl: files?.graduation_marksheetUrl || undefined,
    pg_marksheetUrl: files?.pg_marksheetUrl || undefined,
    resumeUrl: files?.resumeUrl || undefined,
    status: normalizeStatus(apiStaff.status),
    createdAt,
    updatedAt,
    module_permissions: apiStaff.module_permissions,
  };
}

/**
 * Transform array of API staff responses
 */
export function transformApiStaffList(apiStaffList: ApiStaffResponse[]): Staff[] {
  return apiStaffList
    .filter((apiStaff): apiStaff is ApiStaffResponse => Boolean(apiStaff && typeof apiStaff === 'object'))
    .map(transformApiStaffToStaff);
}
