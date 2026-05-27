/**
 * Subject Service
 * CRUD for subjects and class-subject assignments
 */
import { API_CONFIG, API_ENDPOINTS, getAuthHeader } from '../api';

export interface Subject {
  id: string;
  school_id: string;
  name: string;
  code: string;
  description?: string;
  is_active?: boolean;
  is_elective?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSubjectRequest {
  school_id?: string;
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
    return data.message || data.error || fallback;
  } catch {
    return `Error ${response.status}: ${response.statusText}`;
  }
};

export const getAllSubjects = async (schoolId?: string): Promise<Subject[]> => {
  try {
    const params = new URLSearchParams();
    if (schoolId) params.append('school_id', schoolId);
    
    const response = await fetch(`${API_ENDPOINTS.subjects.base()}?${params}`, {
      method: 'GET',
      headers: { ...API_CONFIG.headers, ...getAuthHeader() },
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
      headers: { ...API_CONFIG.headers, ...getAuthHeader() },
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
      headers: { ...API_CONFIG.headers, ...getAuthHeader() },
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
      headers: { ...API_CONFIG.headers, ...getAuthHeader() },
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to delete subject'));
  } catch (error) {
    console.error('Delete Subject error:', error);
    throw error;
  }
};

/**
 * Assign subjects to a specific class for a session
 */
export const assignClassSubjects = async (classId: string, payload: { session_id: string, subject_ids: string[] }): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINTS.classes.subjects(classId), {
      method: 'POST',
      headers: { ...API_CONFIG.headers, ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to assign subjects'));
  } catch (error) {
    console.error('Assign Class Subjects error:', error);
    throw error;
  }
};

/**
 * Get all subjects assigned to a specific class for a session
 */
export const getClassSubjects = async (classId: string, sessionId: string): Promise<Subject[]> => {
  try {
    const params = new URLSearchParams({ session_id: sessionId });
    const response = await fetch(`${API_ENDPOINTS.classes.subjects(classId)}?${params}`, {
      method: 'GET',
      headers: { ...API_CONFIG.headers, ...getAuthHeader() },
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to fetch class subjects'));
    const data = await response.json();
    return (data.data?.data ?? data.data) as Subject[];
  } catch (error) {
    console.error('Get Class Subjects error:', error);
    throw error;
  }
};
