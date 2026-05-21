import { API_ENDPOINTS } from '@/lib/api';

export interface SchoolLoginResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      username: string;
      role: string;
      accountType: string;
      school_id: string;
      module_permissions: Record<string, string[]>;
      password_reset_required: boolean;
      status: string;
      last_login: string | null;
      last_logout: string | null;
      profile: {
        id: string;
        createdAt: string;
        updatedAt: string;
        user_id: string;
        name: string;
        mobileNumber: string | null;
        gender: string;
        aadhaarNumber: string | null;
        panNumber: string | null;
        dateOfBirth: string | null;
        maritalStatus: string;
        alternateMobileNumber: string | null;
        emergencyContact: string | null;
        address: string | null;
        email: string | null;
        fatherName: string | null;
        motherName: string | null;
        dateOfJoining: string | null;
        bankDetails: any;
        designation: string | null;
        experience: string | null;
        qualification: string | null;
        staffType: string;
        remarks: string | null;
      };
    };
  };
  timestamp?: string;
}

export const loginSchoolAdmin = async (username: string, password: string, accountType: string): Promise<SchoolLoginResponse> => {
  const response = await fetch(API_ENDPOINTS.auth.schoolAdmin.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({ username, password, accountType }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  return data;
};

export const forgotPassword = async (email: string): Promise<{ success: boolean; data: { message: string } }> => {
  const response = await fetch(API_ENDPOINTS.auth.schoolAdmin.forgotPassword, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to send reset link');
  }

  return response.json();
};

export const validateResetToken = async (token: string): Promise<{ success: boolean; data: { valid: boolean; email: string } }> => {
  const response = await fetch(API_ENDPOINTS.auth.schoolAdmin.validateToken, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Invalid or expired token');
  }

  return response.json();
};

export const resetPassword = async (token: string, password: string): Promise<{ success: boolean; data: { message: string } }> => {
  const response = await fetch(API_ENDPOINTS.auth.schoolAdmin.resetPassword, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify({ token, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to reset password');
  }

  return response.json();
};

