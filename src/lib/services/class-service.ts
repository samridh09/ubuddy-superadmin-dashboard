/**
 * Class Service
 * CRUD for classes with nested sections
 */
import { API_CONFIG, API_ENDPOINTS, getAuthHeader } from '../api';

export interface Section {
  id: string;
  name: string;
  class_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  school_id: string;
  session_id: string;
  name: string;
  order_index: number;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassRequest {
  school_id: string;
  session_id: string;
  name: string;
  sections: string[];
  order_index: number;
}

export interface UpdateClassRequest {
  name: string;
  sections: string[];
  order_index: number;
}

const parseError = async (response: Response, fallback: string): Promise<string> => {
  try {
    const data = await response.json();
    return data.message || data.error || fallback;
  } catch {
    return `Error ${response.status}: ${response.statusText}`;
  }
};

export const getAllClasses = async (schoolId?: string, sessionId?: string): Promise<Class[]> => {
  try {
    const params = new URLSearchParams();
    if (schoolId) params.append('school_id', schoolId);
    if (sessionId) params.append('session_id', sessionId);
    
    const response = await fetch(`${API_ENDPOINTS.classes.base()}?${params}`, {
      method: 'GET',
      headers: { ...API_CONFIG.headers, ...getAuthHeader() },
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to fetch classes'));
    const data = await response.json();
    // API returns { success: true, data: { data: [...], meta: {...} } }
    return (data.data?.data ?? data.data) as Class[];
  } catch (error) {
    console.error('Get All Classes error:', error);
    throw error;
  }
};

export const createClass = async (data: CreateClassRequest): Promise<Class> => {
  try {
    const response = await fetch(API_ENDPOINTS.classes.base(), {
      method: 'POST',
      headers: { ...API_CONFIG.headers, ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to create class'));
    const responseData = await response.json();
    return responseData.data as Class;
  } catch (error) {
    console.error('Create Class error:', error);
    throw error;
  }
};

export const updateClass = async (id: string, data: UpdateClassRequest): Promise<Class> => {
  try {
    const response = await fetch(API_ENDPOINTS.classes.update(id), {
      method: 'PUT',
      headers: { ...API_CONFIG.headers, ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to update class'));
    const responseData = await response.json();
    return responseData.data as Class;
  } catch (error) {
    console.error('Update Class error:', error);
    throw error;
  }
};

export const deleteClass = async (id: string): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINTS.classes.delete(id), {
      method: 'DELETE',
      headers: { ...API_CONFIG.headers, ...getAuthHeader() },
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to delete class'));
  } catch (error) {
    console.error('Delete Class error:', error);
    throw error;
  }
};
