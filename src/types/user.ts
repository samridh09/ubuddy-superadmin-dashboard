export type UserRole =
  | 'SUPER_ADMIN'
  | 'CONFIGURATION_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'SCHOOL_SUB_ADMIN'
  | 'SCHOOL_STAFF'
  | 'STUDENT'
  | 'TEACHER'
  | 'SUB_ADMIN';

export interface ModulePermission {
  name: string;
  permissions: string[];
}

export interface UserProfileProfile {
  email?: string;
  name?: string;
  display_name?: string;
  phone?: string;
}

/** Full user object returned by /v1/user/@me and login responses */
export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  school_id: string;
  module_permissions: Record<string, string[]>;
  employee_id?: string;
  last_login?: string | null;
  last_logout?: string | null;
  status?: string;
  password_reset_required?: boolean;
  profile?: UserProfileProfile;
}

/** User Modules response from /v1/user/modules */
export interface UserModules {
  modules: ModulePermission[];
  role: UserRole;
}
