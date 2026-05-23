// Student field configuration based on specifications
export type StudentFieldSelection = 'Auto' | 'Manual';

export interface StudentField {
  fieldName: string;
  selection: StudentFieldSelection;
  mandatory: boolean;
  validation: string;
  remarks?: string;
  format?: string;
}

export interface StudentFormConfig {
  id?: string;
  schoolId?: string;
  config: Record<string, boolean>;
  updatedAt?: string;
}

export interface UpdateStudentFormConfigPayload {
  config: Record<string, boolean>;
}

export interface StudentOnboardingPayload {
  name: string;
  gender: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  motherTongue?: string;
  caste?: string;
  subCaste?: string;
  category?: string;
  religion?: string;
  nationality?: string;
  aadhaarNumber?: string;
  pen?: string;
  apaarId?: string;
  samagraId?: string;
  familySamagraId?: string;
  isDifferentlyAbled?: string;
  differentlyAbledDescription?: string;
  bankAccountHolderName?: string;
  bankName?: string;
  ifscCode?: string;
  accountNumber?: string;
  siblingDetails?: string;
  admissionType: string;
  admissionDate?: string;
  scholarNumber?: string;
  classAdmissionTakenId?: string;
  sessionAdmissionTakenId?: string;
  previousClass?: string;
  previousSchool?: string;
  primaryMobileNumber?: string;
  emailAddress?: string;
  address?: string;
  aadhaarCardUrl?: File | string;
  samagraIdDocUrl?: File | string;
  familySamagraIdDocUrl?: File | string;
  birthCertificateUrl?: File | string;
  father?: string;
  mother?: string;
  guardian?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  schoolId: string;
  [key: string]: any;
}

export interface OnboardStudentResponse {
  id: string;
  name?: string;
  [key: string]: any;
}

// ─── All available fields for student form ────────────────────
export const STUDENT_FIELDS: Record<string, StudentField> = {
  // ── Personal Details (Step 1) ──
  name: {
    fieldName: 'Student Name',
    selection: 'Auto',
    mandatory: true,
    validation: "Alphabets, Hyphen (-), Apostrophe ('), Dot (.)",
  },
  gender: {
    fieldName: 'Gender',
    selection: 'Auto',
    mandatory: true,
    validation: 'Male, Female',
    remarks: 'Dropdown',
  },
  dateOfBirth: {
    fieldName: 'D.O.B',
    selection: 'Auto',
    mandatory: false,
    validation: 'No future date',
    format: 'DD-MM-YYYY',
    remarks: 'Auto slash while typing',
  },
  bloodGroup: {
    fieldName: 'Blood Group',
    selection: 'Manual',
    mandatory: false,
    validation: 'Dropdown (all blood groups)',
    remarks: 'Dropdown',
  },
  motherTongue: {
    fieldName: 'Mother Tongue',
    selection: 'Manual',
    mandatory: false,
    validation: 'Alphabets only',
  },
  caste: {
    fieldName: 'Caste',
    selection: 'Manual',
    mandatory: false,
    validation: 'Alphabets only',
  },
  subCaste: {
    fieldName: 'Sub-Caste',
    selection: 'Manual',
    mandatory: false,
    validation: 'Alphabets only',
  },
  category: {
    fieldName: 'Category',
    selection: 'Manual',
    mandatory: false,
    validation: 'General, OBC, SC, ST, SC/ST, Other',
    remarks: 'Dropdown',
  },
  religion: {
    fieldName: 'Religion',
    selection: 'Manual',
    mandatory: false,
    validation: 'Alphabets only',
  },
  nationality: {
    fieldName: 'Nationality',
    selection: 'Manual',
    mandatory: false,
    validation: 'Alphabets only',
    remarks: 'Default: Indian (editable)',
  },

  // ── IDs & Government Records (Step 2) ──
  aadhaarNumber: {
    fieldName: 'Aadhar Number',
    selection: 'Auto',
    mandatory: false,
    validation: '12 digits',
    format: 'XXXX-XXXX-XXXX',
    remarks: 'Auto hyphen after every 4 digits',
  },
  pen: {
    fieldName: 'PEN',
    selection: 'Auto',
    mandatory: false,
    validation: 'Alphanumeric (5-20 chars, uppercase)',
  },
  apaarId: {
    fieldName: 'APAAR ID',
    selection: 'Auto',
    mandatory: false,
    validation: '12 digits',
    format: 'XXXX-XXXX-XXXX',
  },
  samagraId: {
    fieldName: 'Samagra ID',
    selection: 'Auto',
    mandatory: false,
    validation: '9 digits',
    format: 'XXX-XX-XXXX',
  },
  familySamagraId: {
    fieldName: 'Family Samagra ID',
    selection: 'Manual',
    mandatory: false,
    validation: '8 digits',
    format: 'XXX-XX-XXX',
  },

  // ── Academic Details (Step 3) ──
  admissionType: {
    fieldName: 'Admission Type',
    selection: 'Auto',
    mandatory: true,
    validation: 'RTE, Non-RTE',
    remarks: 'Dropdown',
  },
  admissionDate: {
    fieldName: 'Admission Date',
    selection: 'Auto',
    mandatory: false,
    validation: 'Date',
    format: 'DD-MM-YYYY',
  },
  scholarNumber: {
    fieldName: 'Scholar Number',
    selection: 'Auto',
    mandatory: false,
    validation: 'No strict validation',
  },
  classAdmissionTakenId: {
    fieldName: 'Class',
    selection: 'Auto',
    mandatory: false,
    validation: 'Dropdown from school classes',
    remarks: 'Pre-filled if from enquiry',
  },
  sessionAdmissionTakenId: {
    fieldName: 'Session',
    selection: 'Auto',
    mandatory: false,
    validation: 'Dropdown from sessions',
    remarks: 'Pre-filled if from enquiry',
  },
  previousClass: {
    fieldName: 'Previous Class',
    selection: 'Manual',
    mandatory: false,
    validation: 'Free text',
  },
  previousSchool: {
    fieldName: 'Previous School',
    selection: 'Manual',
    mandatory: false,
    validation: 'Free text',
  },

  // ── Contact Details (Step 4) ──
  primaryMobileNumber: {
    fieldName: 'Primary Mobile Number',
    selection: 'Auto',
    mandatory: false,
    validation: '10 digits',
    remarks: 'Used for OTP login (max 2 devices)',
  },
  emailAddress: {
    fieldName: 'Email Address',
    selection: 'Manual',
    mandatory: false,
    validation: 'Standard email',
  },
  address: {
    fieldName: 'Address',
    selection: 'Auto',
    mandatory: false,
    validation: 'Text area',
  },

  // ── Bank Details (Step 4) ──
  bankAccountHolderName: {
    fieldName: 'Account Holder Name',
    selection: 'Manual',
    mandatory: false,
    validation: "Same as name field (alphabets, -, ', .)",
  },
  bankName: {
    fieldName: 'Bank Name',
    selection: 'Manual',
    mandatory: false,
    validation: "Same as name field (alphabets, -, ', .)",
  },
  ifscCode: {
    fieldName: 'IFSC',
    selection: 'Manual',
    mandatory: false,
    validation: 'Alphanumeric (5-20 chars)',
  },
  accountNumber: {
    fieldName: 'Account Number',
    selection: 'Manual',
    mandatory: false,
    validation: 'Numbers (5-20 digits)',
  },

  // ── Extra (Step 6) ──
  siblingDetails: {
    fieldName: 'Sibling Details',
    selection: 'Manual',
    mandatory: false,
    validation: 'Free text',
  },
  isDifferentlyAbled: {
    fieldName: 'Differently Abled',
    selection: 'Manual',
    mandatory: false,
    validation: 'Yes/No (if Yes → description field)',
  },

  // ── Family Details (Step 5) ──
  fatherDetails: {
    fieldName: 'Father Details',
    selection: 'Manual',
    mandatory: false,
    validation: 'Name, DOB, Aadhaar, Phone, Office Address, Qualification, Occupation, Income, PAN, Photo',
  },
  motherDetails: {
    fieldName: 'Mother Details',
    selection: 'Manual',
    mandatory: false,
    validation: 'Same structure as Father',
  },
  guardianDetails: {
    fieldName: 'Guardian Details',
    selection: 'Manual',
    mandatory: false,
    validation: 'Same structure as Father',
  },

  // ── Documents (Step 6) ──
  aadhaarCardUrl: {
    fieldName: 'Aadhar Card Upload',
    selection: 'Manual',
    mandatory: false,
    validation: 'JPG/PNG/PDF (max 2MB)',
  },
  samagraIdDocUrl: {
    fieldName: 'Samagra ID Upload',
    selection: 'Manual',
    mandatory: false,
    validation: 'JPG/PNG/PDF (max 2MB)',
  },
  familySamagraIdDocUrl: {
    fieldName: 'Family Samagra ID Upload',
    selection: 'Manual',
    mandatory: false,
    validation: 'JPG/PNG/PDF (max 2MB)',
  },
  birthCertificateUrl: {
    fieldName: 'Birth Certificate',
    selection: 'Manual',
    mandatory: false,
    validation: 'JPG/PNG/PDF (max 2MB)',
  },
};
