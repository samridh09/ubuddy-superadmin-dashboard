/**
 * Super Admin Authentication
 */
import { API_ENDPOINTS, API_CONFIG } from '../api';
import { type School } from '../services/school-service';
import { authManager } from '../auth-manager';

export interface SuperAdminLoginRequest {
  username: string; // Adjusted to match API spec: "username" instead of "email"
  password: string;
}

export interface SuperAdminLoginResponse {
  success: boolean;
  data: {
    access_token: string;
    user: {
      id: string;
      username: string;
      role: string;
      school_id: string | null;
      permissions: string[];
      assignedSchools?: School[];
    };
  };
  timestamp: string;
}

/**
 * Login Super Admin
 */
export const loginSuperAdmin = async (credentials: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.superAdmin.login, {
      method: 'POST',
      headers: {
        ...API_CONFIG.headers,
      },
      body: JSON.stringify(credentials),
    });

    const responseData = await response.json();

    // With fetch(), 4xx and 5xx are treated as success, so we rely on response.ok.
    // However, some APIs might return success:false in a 200 OK response.
    // We check both response.ok and verify structure if needed.
    if (!response.ok) {
      throw new Error(responseData.message || 'Login failed');
    }

    const { data } = responseData;

    // Store token in localStorage
    if (typeof window !== 'undefined' && data?.access_token) {
      localStorage.setItem('superAdminToken', data.access_token);
      localStorage.setItem('superAdminUser', JSON.stringify(data.user));
    }

    return responseData;
  } catch (error) {
    console.error('Super Admin Login error:', error);
    throw error;
  }
};

/**
 * Login Configuration Admin
 */
export const loginConfigurationAdmin = async (credentials: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.configurationAdmin.login, {
      method: 'POST',
      headers: {
        ...API_CONFIG.headers,
      },
      body: JSON.stringify(credentials),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Login failed');
    }

    const { data } = responseData;

    // Store token in localStorage
    if (typeof window !== 'undefined' && data?.access_token) {
      localStorage.setItem('configAdminToken', data.access_token);
      localStorage.setItem('configAdminUser', JSON.stringify(data.user));
    }

    return responseData;
  } catch (error) {
    console.error('Configuration Admin Login error:', error);
    throw error;
  }
};

/**
 * Get Current User Profile
 */
export const getCurrentUser = async (): Promise<any> => {
  try {
    const response = await fetch(API_ENDPOINTS.superAdmin.me, {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        ...getSuperAdminAuthHeader(),
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch user profile');
    }

    return responseData;
  } catch (error) {
    console.error('Get Current User error:', error);
    throw error;
  }
};

/**
 * Get Super Admin Auth Header
 */
export const getSuperAdminAuthHeader = (): HeadersInit => {
  if (typeof window === 'undefined') return {};
  
  const token =
    localStorage.getItem('authToken') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('superAdminToken') ||
    localStorage.getItem('configAdminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Forgot Password - request reset email
 */
export const forgotPassword = async (email: string, role: 'superadmin' | 'configadmin'): Promise<void> => {
  const url = role === 'superadmin'
    ? API_ENDPOINTS.superAdmin.forgotPassword
    : API_ENDPOINTS.configurationAdmin.forgotPassword;

  const response = await fetch(url, {
    method: 'POST',
    headers: { ...API_CONFIG.headers },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to send reset email');
};

/**
 * Validate reset token
 */
export const validateResetToken = async (token: string, role: 'superadmin' | 'configadmin'): Promise<void> => {
  const url = role === 'superadmin'
    ? API_ENDPOINTS.superAdmin.validateToken
    : API_ENDPOINTS.configurationAdmin.validateToken;

  const response = await fetch(url, {
    method: 'POST',
    headers: { ...API_CONFIG.headers },
    body: JSON.stringify({ token }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Invalid or expired token');
};

/**
 * Reset password using token
 */
export const resetPassword = async (token: string, password: string, role: 'superadmin' | 'configadmin'): Promise<void> => {
  const url = role === 'superadmin'
    ? API_ENDPOINTS.superAdmin.resetPassword
    : API_ENDPOINTS.configurationAdmin.resetPassword;

  const response = await fetch(url, {
    method: 'POST',
    headers: { ...API_CONFIG.headers },
    body: JSON.stringify({ token, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to reset password');
};

/**
 * Logout Super Admin
 */
export const logoutSuperAdmin = () => {
  authManager.clearTokens();
};
