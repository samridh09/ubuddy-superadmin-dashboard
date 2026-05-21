/**
 * School User Service
 * Manages school administrators and users
 */
import { API_CONFIG, API_ENDPOINTS } from '../api';
import { getSuperAdminAuthHeader } from '../authentication/super-admin-auth';

export interface SchoolUser {
  id: string;
  username: string;
  role: string;
  permissions: string[];
  school_id: string;
  last_login: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolUserRequest {
  username: string;
  password: string;
  role: string;
}

export interface SchoolUserResponse {
  success: boolean;
  data: SchoolUser | SchoolUser[];
  message?: string;
}

/**
 * Get all users for a school
 */
export const getAllSchoolUsers = async (): Promise<SchoolUser[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.admin.schoolUsers, {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        ...getSuperAdminAuthHeader(),
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch school users');
    }

    return responseData.data as SchoolUser[];
  } catch (error) {
    console.error('Get All School Users error:', error);
    throw error;
  }
};

/**
 * Create a new school user
 */
export const createSchoolUser = async (data: CreateSchoolUserRequest): Promise<SchoolUser> => {
  try {
    const response = await fetch(API_ENDPOINTS.admin.schoolUsers, {
      method: 'POST',
      headers: {
        ...API_CONFIG.headers,
        ...getSuperAdminAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create school user');
    }

    return responseData.data as SchoolUser;
  } catch (error) {
    console.error('Create School User error:', error);
    throw error;
  }
};
