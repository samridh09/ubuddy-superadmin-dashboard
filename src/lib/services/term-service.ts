import { API_CONFIG, API_ENDPOINTS } from '../api';
import { getSuperAdminAuthHeader } from '../authentication/super-admin-auth';

export interface Term {
  id: string;
  school_id: string;
  session_id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTermRequest {
  school_id: string;
  session_id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export interface UpdateTermRequest {
  name?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Get all terms for a school
 */
export const getTermsBySchool = async (schoolId: string): Promise<Term[]> => {
  try {
    const url = API_ENDPOINTS.terms.base(schoolId);
    const response = await fetch(url, {
      method: 'GET',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch terms');
    }
    return Array.isArray(responseData.data) ? responseData.data : [];
  } catch (error) {
    console.error('Get Terms error:', error);
    throw error;
  }
};

/**
 * Create a new term
 */
export const createTerm = async (data: CreateTermRequest): Promise<Term> => {
  try {
    const url = API_ENDPOINTS.terms.base();
    const response = await fetch(url, {
      method: 'POST',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create term');
    }
    return responseData.data as Term;
  } catch (error) {
    console.error('Create Term error:', error);
    throw error;
  }
};

/**
 * Update a term
 */
export const updateTerm = async (id: string, data: UpdateTermRequest): Promise<Term> => {
  try {
    const url = API_ENDPOINTS.terms.update(id);
    const response = await fetch(url, {
      method: 'PUT',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to update term');
    }
    return responseData.data as Term;
  } catch (error) {
    console.error('Update Term error:', error);
    throw error;
  }
};

/**
 * Delete a term
 */
export const deleteTerm = async (id: string): Promise<void> => {
  try {
    const url = API_ENDPOINTS.terms.delete(id);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { ...API_CONFIG.headers, ...getSuperAdminAuthHeader() },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(responseData.message || 'Failed to delete term');
    }
  } catch (error) {
    console.error('Delete Term error:', error);
    throw error;
  }
};
