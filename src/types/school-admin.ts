/**
 * School Admin types
 */

export interface SchoolAdmin {
  id: string;
  username: string;
  name?: string;
  display_name?: string;
  profile_name?: string;
  full_name?: string;
  module_permissions: Record<string, string[]>;
  school_id?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface CreateSchoolAdminPayload {
  username: string;
  password: string;
  module_permissions: Record<string, string[]>;
}

export interface UpdateSchoolAdminPayload {
  username?: string;
  password?: string;
  module_permissions?: Record<string, string[]>;
}
