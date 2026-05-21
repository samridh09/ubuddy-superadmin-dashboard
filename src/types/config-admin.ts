export type ConfigAdminMode = 'directory' | 'status' | 'terminate' | 'ex';
export type ConfigAdminStatus = 'Active' | 'Inactive' | 'Terminated';

export interface ConfigAdminRecord {
  id: string;
  username: string;
  name: string;
  contact: string;
  role: string;
  status: ConfigAdminStatus;
  lastLogin: string;
  lastLogout: string;
  duration: string;
  createdOn: string;
  createdBy: string;
  terminatedOn?: string;
  terminatedBy?: string;
}
