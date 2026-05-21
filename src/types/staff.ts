// Staff field configuration based on specifications
export type FieldSelection = 'Auto' | 'Custom';
export type StaffType = 'Teaching' | 'Non-Teaching';
export type Gender = 'Male' | 'Female';
export type MaritalStatus = 'Single' | 'Married' | 'Widowed' | 'Divorced' | 'Separated';
export type StaffStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

export interface EmergencyContact {
  number: string;
  name: string;
  relation: string;
}

export interface BankDetails {
  bankName: string;
  ifsc: string;
  accountHolderName: string;
  accountNumber: string;
}

export interface StaffField {
  fieldName: string;
  selection: FieldSelection;
  mandatory: boolean;
  validation: string;
  remarks?: string;
}

export interface Staff {
  // System Generated - Auto fields
  id: string;
  username?: string;
  employeeId: string; // 5 digits starting from 12101
  
  // Mandatory Auto fields
  name: string;
  gender: Gender;
  mobileNumber: string;
  email: string;
  staffType: StaffType;
  
  // Optional Auto fields
  dob?: string;
  maritalStatus?: MaritalStatus;
  alternateMobileNumber?: string;
  emergencyContact?: EmergencyContact;
  address?: string;
  dateOfJoining?: string;
  remarks?: string;
  profileImageUrl?: string;
  
  // Custom fields
  motherName?: string;
  fatherName?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  bankDetails?: BankDetails;
  designation?: string;
  experience?: string;
  qualification?: string;
  
  module_permissions?: Record<string, string[]>;
  
  // Document uploads (Custom fields)
  aadhaarUrl?: string; // File path
  panUrl?: string;
  bankChequeUrl?: string;
  bankPassbookUrl?: string;
  x_marksheetUrl?: string;
  xii_marksheetUrl?: string;
  graduation_marksheetUrl?: string;
  pg_marksheetUrl?: string;
  resumeUrl?: string;
  
  // System fields
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
  terminatedAt?: string;
  terminationRemarks?: string;
}

export interface StaffFormConfig {
  schoolId: string;
  selectedFields: string[]; // Field names that school admin has selected
  updatedAt: string;
}

export interface StaffLog {
  id: string;
  staffId: string;
  employeeId: string;
  action: 'created' | 'updated' | 'activated' | 'deactivated' | 'terminated';
  fieldChanges?: {
    field: string;
    oldValue: string | number | boolean | null | undefined | EmergencyContact | BankDetails;
    newValue: string | number | boolean | null | undefined | EmergencyContact | BankDetails;
  }[];
  performedBy: string;
  performedAt: string;
  remarks?: string;
}

export interface StaffFilters {
  gender?: Gender;
  staffType?: StaffType;
  status?: StaffStatus;
  search?: string;
}

export interface ExportField {
  fieldName: string;
  label: string;
  selected: boolean;
}

// All available fields for staff form
export const STAFF_FIELDS: Record<string, StaffField> = {
  name: {
    fieldName: 'Name',
    selection: 'Auto',
    mandatory: true,
    validation: 'Alphabet, Hyphen (-), Single Apostrophe ( \' ), Dot (.)',
    remarks: ''
  },
  gender: {
    fieldName: 'Gender',
    selection: 'Auto',
    mandatory: true,
    validation: 'Male, Female',
    remarks: 'Dropdown'
  },
  dob: {
    fieldName: 'D.O.B.',
    selection: 'Auto',
    mandatory: false,
    validation: 'No Future Date',
    remarks: 'Manual typing with auto hyphens. User types: 01012001. On screen it appears: 01/01/2001'
  },
  maritalStatus: {
    fieldName: 'Marital Status',
    selection: 'Auto',
    mandatory: false,
    validation: 'Single, Married, Widowed, Divorced, Separated',
    remarks: 'Dropdown'
  },
  mobileNumber: {
    fieldName: 'Mobile Number',
    selection: 'Auto',
    mandatory: true,
    validation: '10 digits',
    remarks: 'Manual typing auto hyphens. User types: 8001238908. On screen it appears: 800-123-8908'
  },
  alternateMobileNumber: {
    fieldName: 'Alternate Mobile Number',
    selection: 'Auto',
    mandatory: false,
    validation: '10 digits',
    remarks: 'Auto hyphens. User types: 8001238908. On screen it appears: 800-123-8908'
  },
  emergencyContact: {
    fieldName: 'Emergency Contact',
    selection: 'Custom',
    mandatory: false,
    validation: '',
    remarks: 'It is divided in three parts – Number, Name, Relation'
  },
  address: {
    fieldName: 'Address',
    selection: 'Auto',
    mandatory: false,
    validation: 'No Validation',
    remarks: 'Text area, no separate fields for city, state or pin code'
  },
  email: {
    fieldName: 'Email',
    selection: 'Auto',
    mandatory: true,
    validation: 'Basic email validation',
    remarks: ''
  },
  motherName: {
    fieldName: 'Mother Name',
    selection: 'Custom',
    mandatory: false,
    validation: 'Same as Name',
    remarks: ''
  },
  fatherName: {
    fieldName: 'Father Name',
    selection: 'Custom',
    mandatory: false,
    validation: 'Same as Name',
    remarks: ''
  },
  aadhaarNumber: {
    fieldName: 'Aadhar Number',
    selection: 'Custom',
    mandatory: false,
    validation: '12 digits',
    remarks: 'Auto hyphens after 4 digits. 1234-7896-1280'
  },
  panNumber: {
    fieldName: 'PAN Number',
    selection: 'Custom',
    mandatory: false,
    validation: 'Ten characters: First five – Upper Caps alphabets, Next 4 – digits, Last – Upper caps alphabet',
    remarks: 'If user presses lower caps alphabet, it should take upper case only'
  },
  bankDetails: {
    fieldName: 'Bank Details',
    selection: 'Custom',
    mandatory: false,
    validation: '',
    remarks: 'Divided in four parts - Bank Name, IFSC, Account Holder Name, Account Number'
  },
  dateOfJoining: {
    fieldName: 'Date of Joining',
    selection: 'Auto',
    mandatory: false,
    validation: 'No Future Date',
    remarks: 'Manual typing with auto hyphens. User types: 01012001. On screen it appears: 01/01/2001'
  },
  staffType: {
    fieldName: 'Staff Type',
    selection: 'Auto',
    mandatory: true,
    validation: 'Teaching, Non-Teaching',
    remarks: 'Dropdown'
  },
  designation: {
    fieldName: 'Designation',
    selection: 'Custom',
    mandatory: false,
    validation: 'Characters, include symbols',
    remarks: ''
  },
  experience: {
    fieldName: 'Experience',
    selection: 'Custom',
    mandatory: false,
    validation: 'Characters, include symbols',
    remarks: ''
  },
  qualification: {
    fieldName: 'Qualification',
    selection: 'Custom',
    mandatory: false,
    validation: 'Characters, include symbols',
    remarks: ''
  },
  remarks: {
    fieldName: 'Remarks',
    selection: 'Auto',
    mandatory: false,
    validation: 'Characters, include symbols',
    remarks: ''
  },
  aadhaarUrl: {
    fieldName: 'Aadhar Card',
    selection: 'Custom',
    mandatory: false,
    validation: 'PDF / JPEG / PNG',
    remarks: 'PDF – Max limit 2 MB, JPEG/PNG – Max limit 2 MB. While uploading auto shrink the size like whatsapp.'
  },
  panUrl: {
    fieldName: 'PAN Card',
    selection: 'Custom',
    mandatory: false,
    validation: 'PDF / JPEG / PNG',
    remarks: 'PDF – Max limit 2 MB, JPEG/PNG – Max limit 2 MB. While uploading auto shrink the size like whatsapp.'
  },
  bankChequeUrl: {
    fieldName: 'Bank Cheque',
    selection: 'Custom',
    mandatory: false,
    validation: 'PDF / JPEG / PNG',
    remarks: 'PDF – Max limit 2 MB, JPEG/PNG – Max limit 2 MB. While uploading auto shrink the size like whatsapp.'
  },
  bankPassbookUrl: {
    fieldName: 'Bank Passbook',
    selection: 'Custom',
    mandatory: false,
    validation: 'PDF / JPEG / PNG',
    remarks: 'PDF – Max limit 2 MB, JPEG/PNG – Max limit 2 MB. While uploading auto shrink the size like whatsapp.'
  },
  profileImageUrl: {
    fieldName: 'Profile Image',
    selection: 'Auto',
    mandatory: false,
    validation: 'JPEG / PNG',
    remarks: 'JPEG/PNG – Max limit 2 MB. While uploading auto shrink the size like whatsapp.'
  },
  x_marksheetUrl: {
    fieldName: 'X Marksheet',
    selection: 'Custom',
    mandatory: false,
    validation: 'PDF / JPEG / PNG',
    remarks: 'PDF – Max limit 2 MB, JPEG/PNG – Max limit 2 MB. While uploading auto shrink the size like whatsapp.'
  },
  xii_marksheetUrl: {
    fieldName: 'XII Marksheet',
    selection: 'Custom',
    mandatory: false,
    validation: 'PDF / JPEG / PNG',
    remarks: 'PDF – Max limit 2 MB, JPEG/PNG – Max limit 2 MB. While uploading auto shrink the size like whatsapp.'
  },
  graduation_marksheetUrl: {
    fieldName: 'Graduation Marksheet',
    selection: 'Custom',
    mandatory: false,
    validation: 'PDF / JPEG / PNG',
    remarks: 'PDF – Max limit 2 MB, JPEG/PNG – Max limit 2 MB. While uploading auto shrink the size like whatsapp.'
  },
  pg_marksheetUrl: {
    fieldName: 'P. G. Marksheet',
    selection: 'Custom',
    mandatory: false,
    validation: 'PDF / JPEG / PNG',
    remarks: 'PDF – Max limit 2 MB, JPEG/PNG – Max limit 2 MB. While uploading auto shrink the size like whatsapp.'
  },
  resumeUrl: {
    fieldName: 'Resume',
    selection: 'Auto',
    mandatory: false,
    validation: 'PDF',
    remarks: 'Max Size – 2 MB. While uploading, auto shrink the size like whatsapp'
  }
};
