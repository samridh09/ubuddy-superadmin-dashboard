/**
 * Sub-Group Service
 * CRUD for sub-groups (e.g., Science stream for 11th class)
 */
import { API_CONFIG, API_ENDPOINTS } from '../api';
import { getSuperAdminAuthHeader } from '../authentication/super-admin-auth';

export interface SubGroupSubject {
  id: string;
  name: string;
  code: string;
}

export interface SubGroup {
  id: string;
  class_id: string;
  name: string;
  subject_ids?: string[];
  subjects?: SubGroupSubject[];
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubGroupRequest {
  class_id: string;
  name: string;
  subject_ids: string[];
}

export interface UpdateSubGroupRequest {
  name?: string;
  subject_ids?: string[];
}

const parseError = async (response: Response, fallback: string): Promise<string> => {
  try {
    const data = await response.json();
    if (Array.isArray(data.error?.message)) {
      return data.error.message.map((m: any) => m.message).join('. ');
    }
    if (Array.isArray(data.message)) {
      return data.message.map((m: any) => typeof m === 'string' ? m : m.message).join('. ');
    }
    return data.message || data.error || fallback;
  } catch {
    return `Error ${response.status}: ${response.statusText}`;
  }
};

export const createSubGroup = async (data: CreateSubGroupRequest): Promise<SubGroup> => {
  try {
    const response = await fetch(API_ENDPOINTS.subGroups.base(), {
      method: 'POST',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to create sub-group'));
    const responseData = await response.json();
    return responseData.data as SubGroup;
  } catch (error) {
    console.error('Create Sub-Group error:', error);
    throw error;
  }
};

export const updateSubGroup = async (id: string, data: UpdateSubGroupRequest): Promise<SubGroup> => {
  try {
    const response = await fetch(API_ENDPOINTS.subGroups.update(id), {
      method: 'PUT',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to update sub-group'));
    const responseData = await response.json();
    return responseData.data as SubGroup;
  } catch (error) {
    console.error('Update Sub-Group error:', error);
    throw error;
  }
};

export const deleteSubGroup = async (id: string): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINTS.subGroups.delete(id), {
      method: 'DELETE',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to delete sub-group'));
  } catch (error) {
    console.error('Delete Sub-Group error:', error);
    throw error;
  }
};
