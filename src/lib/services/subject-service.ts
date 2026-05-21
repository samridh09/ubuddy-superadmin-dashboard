/**
 * Subject Service
 * CRUD for subjects
 */
import { API_CONFIG, API_ENDPOINTS } from '../api';
import { getSuperAdminAuthHeader } from '../authentication/super-admin-auth';

export interface Subject {
  id: string;
  school_id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubjectRequest {
  school_id: string;
  name: string;
  code: string;
  description?: string;
}

export interface UpdateSubjectRequest {
  name?: string;
  code?: string;
  description?: string;
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

export const getAllSubjects = async (schoolId?: string): Promise<Subject[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.subjects.base(schoolId), {
      method: 'GET',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to fetch subjects'));
    const data = await response.json();
    return (data.data?.data ?? data.data) as Subject[];
  } catch (error) {
    console.error('Get All Subjects error:', error);
    throw error;
  }
};

export const createSubject = async (data: CreateSubjectRequest): Promise<Subject> => {
  try {
    const response = await fetch(API_ENDPOINTS.subjects.base(), {
      method: 'POST',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to create subject'));
    const responseData = await response.json();
    return responseData.data as Subject;
  } catch (error) {
    console.error('Create Subject error:', error);
    throw error;
  }
};

export const updateSubject = async (id: string, data: UpdateSubjectRequest): Promise<Subject> => {
  try {
    const response = await fetch(API_ENDPOINTS.subjects.update(id), {
      method: 'PUT',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to update subject'));
    const responseData = await response.json();
    return responseData.data as Subject;
  } catch (error) {
    console.error('Update Subject error:', error);
    throw error;
  }
};

export const deleteSubject = async (id: string): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINTS.subjects.delete(id), {
      method: 'DELETE',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to delete subject'));
  } catch (error) {
    console.error('Delete Subject error:', error);
    throw error;
  }
};
