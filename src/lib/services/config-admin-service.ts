/**
 * Config Admin Service
 * Manages configuration administrators
 */
import { API_ENDPOINTS } from '../api';
import axiosClient from '../axios';
import type { HistoryEntry, ChangeLogEntry } from '@/types';

export interface ConfigAdmin {
  id: string;
  username: string;
  role: string;
  status: string;
  full_name: string;
  gender: string;
  date_of_birth: string | null;
  designation: string;
  mobile_number: string;
  alternate_mobile: string | null;
  email_address: string | null;
  remarks: string | null;
  profile_photo: string | null;
  last_login: string | null;
  last_logout: string | null;
  duration: string | null;
  created_at: string;
  updated_at: string;
  password_reset_required?: boolean;
  module_permissions?: Record<string, string[]>;
  assignedSchools: {
    id: string;
    name: string;
    code: string;
  }[];
}

export interface CreateConfigAdminRequest {
  // Personal Information
  name: string;
  gender: string;
  designation: string;
  dateOfBirth: string; // dd-mm-yyyy
  mobileNumber: string; // 10 digits
  alternateMobileNumber?: string; // 10 digits
  email?: string;
  remarks?: string;
  
  // Account Information
  username: string;
  
  // Documents
  aadhaarNumber?: string; // 12 digits
  profileImageUrl?: File;
  aadhaarUrl?: File; // PDF
  
  // School Assignment
  assigned_school_ids: string[];
}

export interface UpdateConfigAdminRequest {
  name?: string;
  gender?: string;
  designation?: string;
  dateOfBirth?: string; // dd-mm-yyyy
  mobileNumber?: string;
  alternateMobileNumber?: string;
  email?: string;
  remarks?: string;
  username?: string;
  password?: string;
  status?: string;
  role?: string;
  aadhaarNumber?: string;
  profileImageUrl?: File;
  module_permissions?: Record<string, unknown>;
  assigned_school_ids?: string[];
}

/**
 * Get all configuration admins
 */
export const getAllConfigAdmins = async (schoolId?: string): Promise<ConfigAdmin[]> => {
  try {
    const { data: responseData } = await axiosClient.get(API_ENDPOINTS.configAdmins.base(schoolId));
    return responseData.data as ConfigAdmin[];
  } catch (error) {
    console.error('Get All Config Admins error:', error);
    throw error;
  }
};

/**
 * Get a configuration admin by ID
 */
export const getConfigAdminById = async (id: string): Promise<ConfigAdmin> => {
  try {
    const { data: responseData } = await axiosClient.get(API_ENDPOINTS.configAdmins.getById(id));
    return responseData.data as ConfigAdmin;
  } catch (error) {
    console.error('Get Config Admin error:', error);
    throw error;
  }
};

/**
 * Create a new configuration admin
 */
export const createConfigAdmin = async (data: CreateConfigAdminRequest): Promise<ConfigAdmin> => {
  try {
    // Create FormData for multipart/form-data submission
    const formData = new FormData();
    
    // Add all required fields
    formData.append('name', data.name);
    formData.append('gender', data.gender);
    formData.append('designation', data.designation);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('username', data.username);
    
    // Add school IDs as array
    data.assigned_school_ids.forEach(schoolId => {
      formData.append('assigned_school_ids[]', schoolId);
    });
    
    // Add optional fields if provided
    if (data.alternateMobileNumber) {
      formData.append('alternateMobileNumber', data.alternateMobileNumber);
    }
    if (data.email) {
      formData.append('email', data.email);
    }
    if (data.remarks) {
      formData.append('remarks', data.remarks);
    }
    if (data.aadhaarNumber) {
      formData.append('aadhaarNumber', data.aadhaarNumber);
    }
    
    // Add file uploads if provided
    if (data.profileImageUrl instanceof File) {
      formData.append('profileImageUrl', data.profileImageUrl);
    }
    if (data.aadhaarUrl instanceof File) {
      formData.append('aadhaarUrl', data.aadhaarUrl);
    }

    const { data: responseData } = await axiosClient.post(API_ENDPOINTS.configAdmins.base(), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return responseData.data as ConfigAdmin;
  } catch (error) {
    console.error('Create Config Admin error:', error);
    throw error;
  }
};

/**
 * Update an existing configuration admin
 */
export const updateConfigAdmin = async (id: string, data: UpdateConfigAdminRequest): Promise<ConfigAdmin> => {
  try {
    const formData = new FormData();
    
    // Only append fields that are explicitly provided in the data object
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) return;

      if (key === 'assigned_school_ids' && Array.isArray(value)) {
        formData.append('assigned_school_ids', value.join(','));
      } else if (key === 'module_permissions' && value !== null) {
        formData.append('module_permissions', JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null) {
        formData.append(key, String(value));
      }
    });

    const { data: responseData } = await axiosClient.put(API_ENDPOINTS.configAdmins.update(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return responseData.data as ConfigAdmin;
  } catch (error) {
    console.error('Update Config Admin error:', error);
    throw error;
  }
};

/**
 * Update status of a configuration admin
 */
export const updateConfigAdminStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<ConfigAdmin> => {
  try {
    const { data: responseData } = await axiosClient.patch(API_ENDPOINTS.configAdmins.updateStatus(id, status));
    return responseData.data as ConfigAdmin;
  } catch (error) {
    console.error('Update Config Admin Status error:', error);
    throw error;
  }
};

/**
 * Terminate a configuration admin
 */
export const terminateConfigAdmin = async (id: string): Promise<ConfigAdmin> => {
  try {
    const { data: responseData } = await axiosClient.post(API_ENDPOINTS.configAdmins.terminate(id));
    return responseData.data as ConfigAdmin;
  } catch (error) {
    console.error('Terminate Config Admin error:', error);
    throw error;
  }
};

/**
 * Parse API change strings into structured ChangeLogEntry objects.
 * Handles: "field: oldValue → newValue" and plain messages like "Admin account updated"
 */
function parseChanges(raw: string[]): ChangeLogEntry[] {
  return raw.map((s) => {
    const arrowIdx = s.indexOf(' → ');
    const colonIdx = s.indexOf(': ');
    if (arrowIdx !== -1 && colonIdx !== -1 && colonIdx < arrowIdx) {
      return {
        fieldName: s.slice(0, colonIdx).trim(),
        oldValue:  s.slice(colonIdx + 2, arrowIdx).trim(),
        newValue:  s.slice(arrowIdx + 3).trim(),
      };
    }
    return { fieldName: 'Note', oldValue: '', newValue: s };
  });
}

/**
 * Get audit history for a configuration admin
 */
export const getConfigAdminHistory = async (adminId: string): Promise<HistoryEntry[]> => {
  try {
    const { data: responseData } = await axiosClient.get(API_ENDPOINTS.configAdmins.history(adminId));
    const raw: { id: string; action: string; changes: string[]; createdAt: string; performedBy: { id: string; name: string } }[] =
      responseData.data?.data ?? [];
    return raw.map((entry) => ({
      id:          entry.id,
      action:      entry.action,
      createdAt:   entry.createdAt,
      performedBy: entry.performedBy,
      changes:     parseChanges(entry.changes),
    }));
  } catch (error) {
    console.error('Get Config Admin History error:', error);
    throw error;
  }
};

/**
 * Delete a configuration admin
 */
export const deleteConfigAdmin = async (id: string): Promise<void> => {
  try {
    await axiosClient.delete(API_ENDPOINTS.configAdmins.delete(id));
  } catch (error) {
    console.error('Delete Config Admin error:', error);
    throw error;
  }
};
