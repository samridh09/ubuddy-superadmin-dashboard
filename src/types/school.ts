export interface SchoolAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface SchoolPOC {
  id: string;
  name: string;
  gender: string;
  date_of_birth?: string;
  designation: string;
  primary_contact_number: string;
  alternate_contact_number?: string | null;
  remarks?: string;
}

/** POC shape used in the create/edit form (camelCase, with temp id) */
export interface SchoolPOCFormData {
  id: string;
  name: string;
  gender: string;
  dob?: string;
  designation: string;
  contactNumber: string;
  alternateNumber: string;
  remarks: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  udise_code: string;
  affiliation_number: string;
  board: string;
  medium: string;
  website_url?: string;
  email: string;
  contact_number: string;
  alternative_contact_number?: string | null;
  address: SchoolAddress;
  status: string;
  logo_url?: string;
  remarks?: string;
  total_students_limit: number;
  total_students_count: number;
  total_sub_admins_limit: number;
  total_sub_admins_count: number;
  assigned_modules: string[];
  principal_name?: string;
  principal_gender?: string;
  principal_dob?: string;
  director_name?: string;
  director_gender?: string;
  director_dob?: string;
  default_admin_username?: string;
  pocs: SchoolPOC[];
  createdAt: string;
  updatedAt: string;
}

export interface SchoolProfilePayload {
  name: string;
  udise_code: string;
  affiliation_number: string;
  email: string;
  website_url: string;
  contact_number: string;
  alternative_contact_number: string;
  address: { street: string; city: string; state: string; zipCode: string };
  remarks: string;
  principal_name: string;
  principal_gender: string;
  principal_dob: string;
  director_name: string;
  director_gender: string;
  director_dob: string;
  pocs: {
    name: string;
    gender: string;
    dateOfBirth: string;
    designation: string;
    primaryContactNumber: string;
    alternateContactNumber: string;
    remarks: string;
  }[];
}

export interface SchoolModule {
  key: string;
  name: string;
}

export interface SchoolModulesResponse {
  modules: SchoolModule[];
  defaults: string[];
}

/** View-model row used in the school list table */
export interface SchoolTableRow {
  id: string;
  slNo: number;
  name: string;
  uCode: string;
  city: string;
  status: 'Active' | 'Inactive';
  studentCount: number;
  studentLimit: number;
  subAdminCount: number;
  subAdminLimit: number;
}

/** View-model row used in the school status table */
export interface SchoolStatusRow {
  id: string;
  slNo: number;
  name: string;
  uCode: string;
  city: string;
  status: 'Active' | 'Inactive';
}

/** Form state shape for the school edit page */
export interface SchoolDraft {
  name: string;
  udiseCode: string;
  schoolCode: string;
  affiliationCode: string;
  principalName: string;
  principalGender: string;
  principalDob: string;
  directorName: string;
  directorGender: string;
  directorDob: string;
  state: string;
  city: string;
  address: string;
  email: string;
  website: string;
  phone: string;
  alternatePhone: string;
  username: string;
  remarks: string;
  pocs: SchoolPOCFormData[];
}

/** Session entry (used in manage-sessions view) */
export interface SchoolSession {
  id: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isLocked: boolean;
}

/** Grade configuration row for school grade config view */
export interface GradeRow {
  id: string;
  fromMarks: string;
  toMarks: string;
  grade: string;
  remarks: string;
}

export interface GradeRowErrors {
  fromMarks?: string;
  toMarks?: string;
  grade?: string;
}

/** Form state shape for the create/edit school page */
export interface SchoolFormState {
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
}

export interface ClassResultType {
  className: string;
  type: 'Grade' | 'Marking';
}

export interface BasicConfigItem {
  id: string;
  name: string;
  route: string;
}

export interface ResultConfigItem {
  id: string;
  name: string;
  route: string;
}

export interface ModuleConfigItem {
  id: string;
  name: string;
  route: string;
}

export interface ModuleAssignment {
  key: string;
  name: string;
  isAssigned: boolean;
  isDefault: boolean;
}

export interface SubjectMarkingPattern {
  max: string;
  min: string;
}

export interface SubjectMarking {
  subject: string;
  patterns: SubjectMarkingPattern[];
}

export interface SchoolViewProfilePOC {
  id: string;
  name: string;
  gender: string;
  dob?: string;
  designation: string;
  contactNumber: string;
  alternateNumber?: string;
  remarks?: string;
}

export interface SchoolProfileViewData {
  id: string;
  name: string;
  uCode: string;
  udiseCode: string;
  schoolCode: string;
  affiliationCode: string;
  status: 'Active' | 'Inactive';
  principalName: string;
  principalGender: string;
  principalDob: string;
  directorName: string;
  directorGender: string;
  directorDob: string;
  address: string;
  city: string;
  state: string;
  email: string;
  website: string;
  phone: string;
  alternatePhone: string;
  username: string;
  remarks: string;
  logoUrl?: string;
  pocs: SchoolViewProfilePOC[];
}
