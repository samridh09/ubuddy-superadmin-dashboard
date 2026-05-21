/**
 * Super Sub Admin Service
 * Manages super sub-admin users and their permissions.
 */
import { API_CONFIG, API_ENDPOINTS } from '../api';
import { getSuperAdminAuthHeader } from '../authentication/super-admin-auth';
import { sanitizeModulePermissions, type ModulePermissions } from '../permissions';

export type { ModulePermissions };

export interface SuperSubAdmin {
  id: string;
  username: string;
  role: string;
  status: string;
  last_login: string | null;
  generated_password?: string;
  module_permissions: ModulePermissions;
  profile: {
    id: string;
    name: string;
    mobileNumber: string;
    alternateMobileNumber?: string;
    gender: string;
    aadhaarNumber?: string;
    dateOfBirth: string;
    email?: string;
    remarks?: string;
    [key: string]: unknown;
  } | null;
  files: {
    id: string;
    aadhaarUrl: string | null;
    profileImageUrl: string | null;
    [key: string]: unknown;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSuperSubAdminRequest {
  name: string;
  gender: string;
  dateOfBirth: string;
  mobileNumber: string;
  alternateMobileNumber?: string;
  email?: string;
  remarks?: string;
  username: string;
  aadhaarNumber?: string;
  module_permissions?: ModulePermissions;
  profileImageUrl?: File;
  aadhaarUrl?: File;
}

export interface UpdateSuperSubAdminRequest {
  username?: string;
  module_permissions?: ModulePermissions;
}

export interface UserPermissionsResponse {
  userId?: string;
  user_id?: string;
  role?: string;
  module_permissions: ModulePermissions;
  permissions?: string[];
  [key: string]: unknown;
}

export interface UpdateUserPermissionsRequest {
  module_permissions: ModulePermissions;
}

const parseError = async (response: Response, fallback: string) => {
  let errorMessage = fallback;
  try {
    const responseData = await response.json();
    if (Array.isArray(responseData.error?.message)) {
      errorMessage = responseData.error.message.map((m: { message?: string }) => m.message || '').filter(Boolean).join('. ');
    } else if (Array.isArray(responseData.message)) {
      errorMessage = responseData.message.map((m: string | { message?: string }) => typeof m === 'string' ? m : m.message || '').filter(Boolean).join('. ');
    } else {
      errorMessage = responseData.message || responseData.error || fallback;
    }
  } catch {
    errorMessage = `Error ${response.status}: ${response.statusText}`;
  }
  return errorMessage;
};

export const getAllSuperSubAdmins = async (): Promise<SuperSubAdmin[]> => {
  const response = await fetch(API_ENDPOINTS.superSubAdmins.base, {
    method: 'GET',
    headers: {
      ...API_CONFIG.headers,
      ...getSuperAdminAuthHeader(),
    },
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch super sub-admins');
  }

  return responseData.data as SuperSubAdmin[];
};

export const getSuperSubAdminById = async (id: string): Promise<SuperSubAdmin> => {
  if (!id?.trim()) {
    throw new Error('Invalid user id');
  }

  const response = await fetch(API_ENDPOINTS.superSubAdmins.getById(id), {
    method: 'GET',
    headers: {
      ...API_CONFIG.headers,
      ...getSuperAdminAuthHeader(),
    },
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch super sub-admin');
  }

  return responseData.data as SuperSubAdmin;
};

export const createSuperSubAdmin = async (data: CreateSuperSubAdminRequest): Promise<SuperSubAdmin> => {
  if (!data?.username?.trim()) {
    throw new Error('Username is required');
  }

  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('gender', data.gender);
  formData.append('dateOfBirth', data.dateOfBirth);
  formData.append('mobileNumber', data.mobileNumber);
  formData.append('username', data.username);

  if (data.alternateMobileNumber) formData.append('alternateMobileNumber', data.alternateMobileNumber);
  if (data.email) formData.append('email', data.email);
  if (data.remarks) formData.append('remarks', data.remarks);
  if (data.aadhaarNumber) formData.append('aadhaarNumber', data.aadhaarNumber);

  const sanitizedPermissions = sanitizeModulePermissions(data.module_permissions || {});
  if (Object.keys(sanitizedPermissions).length > 0) {
    formData.append('module_permissions', JSON.stringify(sanitizedPermissions));
  }

  if (data.profileImageUrl instanceof File) {
    formData.append('profileImageUrl', data.profileImageUrl);
  }

  if (data.aadhaarUrl instanceof File) {
    formData.append('aadhaarUrl', data.aadhaarUrl);
  }

  const response = await fetch(API_ENDPOINTS.superSubAdmins.base, {
    method: 'POST',
    headers: getSuperAdminAuthHeader(),
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 413) {
      throw new Error('File size too large. Please upload smaller files (max 2MB).');
    }
    throw new Error(await parseError(response, 'Failed to create super sub-admin'));
  }

  const responseData = await response.json();
  return responseData.data as SuperSubAdmin;
};

export const updateSuperSubAdmin = async (id: string, data: UpdateSuperSubAdminRequest): Promise<SuperSubAdmin> => {
  if (!id?.trim()) {
    throw new Error('Invalid user id');
  }

  const payload: UpdateSuperSubAdminRequest = {
    ...data,
    module_permissions: data.module_permissions ? sanitizeModulePermissions(data.module_permissions) : undefined,
  };

  const response = await fetch(API_ENDPOINTS.superSubAdmins.update(id), {
    method: 'PUT',
    headers: {
      ...API_CONFIG.headers,
      ...getSuperAdminAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to update super sub-admin');
  }

  return responseData.data as SuperSubAdmin;
};

export const deleteSuperSubAdmin = async (id: string): Promise<void> => {
  if (!id?.trim()) {
    throw new Error('Invalid user id');
  }

  const response = await fetch(API_ENDPOINTS.superSubAdmins.delete(id), {
    method: 'DELETE',
    headers: {
      ...API_CONFIG.headers,
      ...getSuperAdminAuthHeader(),
    },
    body: JSON.stringify({}),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to delete super sub-admin');
  }
};

export const getUserPermissions = async (userId: string): Promise<UserPermissionsResponse> => {
  if (!userId?.trim()) {
    throw new Error('Invalid user id');
  }

  const response = await fetch(API_ENDPOINTS.users.permissions(userId), {
    method: 'GET',
    headers: {
      ...API_CONFIG.headers,
      ...getSuperAdminAuthHeader(),
    },
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch user permissions');
  }

  return responseData.data as UserPermissionsResponse;
};

export const updateUserPermissions = async (
  userId: string,
  data: UpdateUserPermissionsRequest
): Promise<UserPermissionsResponse> => {
  if (!userId?.trim()) {
    throw new Error('Invalid user id');
  }

  const payload: UpdateUserPermissionsRequest = {
    module_permissions: sanitizeModulePermissions(data.module_permissions || {}),
  };

  const response = await fetch(API_ENDPOINTS.users.permissions(userId), {
    method: 'PATCH',
    headers: {
      ...API_CONFIG.headers,
      ...getSuperAdminAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to update user permissions');
  }

  return responseData.data as UserPermissionsResponse;
};
