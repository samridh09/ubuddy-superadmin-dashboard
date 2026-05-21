import { API_CONFIG, API_ENDPOINTS } from '../api';
import { getSuperAdminAuthHeader } from '../authentication/super-admin-auth';

export interface SchoolPoc {
  id: string;
  school_id: string;
  name: string;
  gender: string;
  date_of_birth: string;
  designation: string;
  primary_contact_number: string;
  alternate_contact_number?: string;
  remarks?: string;
  profile_image_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolPocRequest {
  school_id: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  designation: string;
  primaryContactNumber: string;
  alternateContactNumber?: string;
  remarks?: string;
  profileImageUrl?: File | null;
}

export interface UpdateSchoolPocRequest extends Partial<CreateSchoolPocRequest> {}

/**
 * Get all POCs for a school
 */
export const getSchoolPocs = async (schoolId?: string): Promise<SchoolPoc[]> => {
  try {
    const url = API_ENDPOINTS.schoolPocs.base(schoolId);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        ...getSuperAdminAuthHeader(),
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch school POCs');
    }

    return responseData.data as SchoolPoc[];
  } catch (error) {
    console.error('Get School POCs error:', error);
    throw error;
  }
};

/**
 * Get a single school POC by ID
 */
export const getSchoolPocById = async (id: string): Promise<SchoolPoc> => {
  try {
    const response = await fetch(API_ENDPOINTS.schoolPocs.getById(id), {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        ...getSuperAdminAuthHeader(),
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch school POC');
    }

    return responseData.data as SchoolPoc;
  } catch (error) {
    console.error('Get School POC By ID error:', error);
    throw error;
  }
};

/**
 * Create a new school POC
 */
export const createSchoolPoc = async (data: CreateSchoolPocRequest): Promise<SchoolPoc> => {
  try {
    const formData = new FormData();
    formData.append('school_id', data.school_id);
    formData.append('name', data.name);
    formData.append('gender', data.gender);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('designation', data.designation);
    formData.append('primaryContactNumber', data.primaryContactNumber);
    
    if (data.alternateContactNumber) {
      formData.append('alternateContactNumber', data.alternateContactNumber);
    }
    if (data.remarks) {
      formData.append('remarks', data.remarks);
    }
    if (data.profileImageUrl) {
      formData.append('profileImageUrl', data.profileImageUrl);
    }

    const authHeader = getSuperAdminAuthHeader();
    
    const response = await fetch(API_ENDPOINTS.schoolPocs.base(), {
      method: 'POST',
      headers: {
        ...authHeader, // Do not set Content-Type to application/json, browser will set multipart/form-data
      },
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create school POC');
    }

    return responseData.data as SchoolPoc;
  } catch (error) {
    console.error('Create School POC error:', error);
    throw error;
  }
};

/**
 * Update a school POC
 */
export const updateSchoolPoc = async (id: string, data: UpdateSchoolPocRequest): Promise<SchoolPoc> => {
  try {
    const formData = new FormData();
    if (data.school_id) formData.append('school_id', data.school_id);
    if (data.name) formData.append('name', data.name);
    if (data.gender) formData.append('gender', data.gender);
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (data.designation) formData.append('designation', data.designation);
    if (data.primaryContactNumber) formData.append('primaryContactNumber', data.primaryContactNumber);
    if (data.alternateContactNumber !== undefined) formData.append('alternateContactNumber', data.alternateContactNumber);
    if (data.remarks !== undefined) formData.append('remarks', data.remarks);
    if (data.profileImageUrl) {
      formData.append('profileImageUrl', data.profileImageUrl);
    }

    const authHeader = getSuperAdminAuthHeader();

    const response = await fetch(API_ENDPOINTS.schoolPocs.update(id), {
      method: 'PUT',
      headers: {
        ...authHeader,
      },
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to update school POC');
    }

    return responseData.data as SchoolPoc;
  } catch (error) {
    console.error('Update School POC error:', error);
    throw error;
  }
};

/**
 * Delete a school POC
 */
export const deleteSchoolPoc = async (id: string): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINTS.schoolPocs.delete(id), {
      method: 'DELETE',
      headers: {
        ...API_CONFIG.headers,
        ...getSuperAdminAuthHeader(),
      },
      body: JSON.stringify({}),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to delete school POC');
    }
  } catch (error) {
    console.error('Delete School POC error:', error);
    throw error;
  }
};
