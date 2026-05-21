export type SubAdminMode = 'directory' | 'status' | 'terminate' | 'ex';
export type SubAdminDisplayStatus = 'Active' | 'Inactive' | 'Terminated';
export type SubAdminApiStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

export interface SubAdminProfile {
  id: string;
  name: string;
  mobileNumber: string | null;
  gender: string;
  aadhaarNumber: string | null;
  panNumber: string | null;
  dateOfBirth: string | null;
  maritalStatus: string;
  alternateMobileNumber: string | null;
  emergencyContact: string | null;
  address: string | null;
  email: string | null;
  fatherName: string | null;
  motherName: string | null;
  dateOfJoining: string | null;
  bankDetails: string | null;
  designation: string | null;
  experience: string | null;
  qualification: string | null;
  staffType: string;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  user_id: string;
}

export interface SubAdminFiles {
  id: string;
  profileImageUrl: string | null;
  aadhaarUrl: string | null;
  panUrl: string | null;
  bankChequeUrl: string | null;
  resumeUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user_id: string;
}

export interface SubAdminRecord {
  id: string;
  username: string;
  role: string;
  status: SubAdminApiStatus;
  school_id: string;
  module_permissions: Record<string, string[]>;
  last_login: string | null;
  last_logout: string | null;
  profile: SubAdminProfile;
  files: SubAdminFiles | null;
}

export interface SubAdminDirectoryRow {
  id: string;
  name: string;
  contact: string;
  status: SubAdminDisplayStatus;
  lastLogin: string;
  lastLogout: string;
  duration: string;
  _raw: SubAdminRecord;
}

export interface SubAdminStatusRow {
  id: string;
  name: string;
  username: string;
  employeeId: string;
  role: string;
  status: SubAdminDisplayStatus;
  _raw: SubAdminRecord;
}

export interface SubAdminPermissionEntry {
  module: string;
  permissions: { add: boolean; edit: boolean; delete: boolean; export: boolean };
}

export interface SubAdminEditPermissionEntry {
  id: number;
  moduleKey: string;
  module: string;
  isAssigned: boolean;
  permissions: {
    add: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
  };
}

export interface ChangeLogEntry {
  fieldName: string;
  oldValue: string;
  newValue: string;
}

export interface HistoryEntry {
  id: string;
  action: string;
  changes: ChangeLogEntry[];
  createdAt: string;
  performedBy: { id: string; name: string };
}

export interface SubAdminProfileViewData {
  name:                  string;
  username:              string;
  employeeId:            string;
  role:                  string;
  status:                'Active' | 'Inactive' | 'Terminated';
  avatar?:               string;
  gender:                string;
  dateOfBirth:           string;
  designation:           string;
  mobileNumber:          string;
  alternateMobileNumber: string;
  email:                 string;
  remarks:               string;
}

export interface SubAdminEditData {
  name:                  string;
  username:              string;
  gender:                string;
  dateOfBirth:           string;
  designation:           string;
  mobileNumber:          string;
  alternateMobileNumber: string;
  email:                 string;
  remarks:               string;
  status:                string;
  avatar?:               string;
}
