import { API_ENDPOINTS } from '@/lib/api';

export interface SubAdminLoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    role: string;
    school_id: string;
    module_permissions: Record<string, string[]>;
  };
}

export const loginSubAdmin = async (schoolId: string, username: string, password: string): Promise<SubAdminLoginResponse> => {
  const response = await fetch(API_ENDPOINTS.auth.teacher.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ school_id: schoolId, username, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Login failed');
  }

  return response.json();
};
