import { API_ENDPOINTS } from '@/lib/api';

export interface StudentLoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    role: string;
    school_id: string;
    module_permissions: Record<string, string[]>;
  };
}

export const loginStudent = async (username: string, password: string): Promise<StudentLoginResponse> => {
  const response = await fetch(API_ENDPOINTS.auth.student.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Login failed');
  }

  return response.json();
};
