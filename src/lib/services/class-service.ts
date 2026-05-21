/**
 * Class Service
 * CRUD for classes + subject assignment + sub-groups
 */
import { API_CONFIG, API_ENDPOINTS } from '../api';
import { getSuperAdminAuthHeader } from '../authentication/super-admin-auth';

export interface Class {
  id: string;
  school_id: string;
  class_enum: string;
  display_name: string;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    name: string;
    code: string;
    board?: string;
    medium?: string;
  };
}

export interface CreateClassRequest {
  school_id: string;
  class_enum: string;
  display_name: string;
}

export interface UpdateClassRequest {
  class_enum?: string;
  display_name?: string;
}

export const CLASS_ENUM_OPTIONS = [
  'Pre-Nursery', 'Nursery', 'LKG', 'UKG',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
];

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

export const getAllClasses = async (schoolId?: string): Promise<Class[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.classes.base(schoolId), {
      method: 'GET',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to fetch classes'));
    const data = await response.json();
    return (data.data?.data ?? data.data) as Class[];
  } catch (error) {
    console.error('Get All Classes error:', error);
    throw error;
  }
};

export const getClassById = async (id: string): Promise<Class> => {
  try {
    const response = await fetch(API_ENDPOINTS.classes.getById(id), {
      method: 'GET',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to fetch class'));
    const data = await response.json();
    return data.data as Class;
  } catch (error) {
    console.error('Get Class error:', error);
    throw error;
  }
};

export const createClass = async (data: CreateClassRequest): Promise<Class> => {
  try {
    const response = await fetch(API_ENDPOINTS.classes.base(), {
      method: 'POST',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
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
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
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
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to delete class'));
  } catch (error) {
    console.error('Delete Class error:', error);
    throw error;
  }
};

export const getClassSubjects = async (classId: string): Promise<any[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.classes.subjects(classId), {
      method: 'GET',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to fetch class subjects'));
    const data = await response.json();
    return (data.data?.data ?? data.data);
  } catch (error) {
    console.error('Get Class Subjects error:', error);
    throw error;
  }
};

export const assignClassSubjects = async (classId: string, subjectIds: string[]): Promise<any> => {
  try {
    const response = await fetch(API_ENDPOINTS.classes.subjects(classId), {
      method: 'POST',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify({ subject_ids: subjectIds }),
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to assign subjects'));
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Assign Class Subjects error:', error);
    throw error;
  }
};

export const getClassSubGroups = async (classId: string): Promise<any[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.classes.subGroups(classId), {
      method: 'GET',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
    });
    if (!response.ok) throw new Error(await parseError(response, 'Failed to fetch sub-groups'));
    const data = await response.json();
    return (data.data?.data ?? data.data);
  } catch (error) {
    console.error('Get Class Sub-Groups error:', error);
    throw error;
  }
};
