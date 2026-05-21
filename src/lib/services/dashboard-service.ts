import { API_ENDPOINTS, getAuthHeader } from '../api';
import { fetchWithAuth } from '../api-client';

export interface DashboardSubModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  permissions: string[];
  hasAccess: boolean;
}

export interface DashboardModule extends DashboardSubModule {
  group: string;
  subModules?: DashboardSubModule[];
}

export interface DashboardData {
  modules: DashboardModule[];
  totalModules: number;
  accessibleModules: number;
  groups: Record<string, DashboardModule[]>;
}

interface DashboardApiResponse {
  success: boolean;
  data: DashboardData;
  timestamp: string;
}

export const getAdminDashboard = async (): Promise<DashboardData> => {
  const response = await fetchWithAuth(API_ENDPOINTS.dashboard.adminModules, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  });

  if (response.status === 401) throw new Error('UNAUTHORIZED');
  if (response.status === 403) throw new Error("You don't have access to this resource.");

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch dashboard (${response.status})`);
  }

  const json: DashboardApiResponse = await response.json();

  if (!json.success || !json.data) {
    throw new Error('Invalid dashboard response from server.');
  }

  return json.data;
};
