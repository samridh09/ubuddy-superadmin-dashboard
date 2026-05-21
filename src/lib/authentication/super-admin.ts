import { API_ENDPOINTS } from '@/lib/api';

export interface SuperAdminLoginResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      username: string;
      role: string;
      accountType: string;
      school_id: string | null;
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
        bloodGroup: string | null;
        religion: string | null;
        nationality: string | null;
      };
    };
  };
  timestamp?: string;
}

export const loginSuperAdmin = async (username: string, password: string, accountType: string = 'SUPER_ADMIN'): Promise<SuperAdminLoginResponse> => {
  const loginUrl = accountType === 'CONFIGURATION_ADMIN'
    ? API_ENDPOINTS.auth.configurationAdmin.login
    : API_ENDPOINTS.auth.superAdmin.login;

  const response = await fetch(loginUrl, {
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
