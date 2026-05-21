/**
 * Super Admin Dashboard Service
 */
import { API_ENDPOINTS, API_CONFIG } from '../api';
import { getSuperAdminAuthHeader, type SuperAdminLoginResponse } from '../authentication/super-admin-auth';

export interface SuperAdminDashboardData {
  message: string;
  role: string;
  features: string[];
}

/**
 * Get Super Admin Dashboard Data
 */
export const getSuperAdminDashboard = async (): Promise<SuperAdminDashboardData> => {
  try {
    const response = await fetch(API_ENDPOINTS.superAdmin.dashboard, {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        ...getSuperAdminAuthHeader(),
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized (redirect to login usually handled by router/component)
        throw new Error('Unauthorized');
      }
      throw new Error(responseData.message || 'Failed to fetch dashboard data');
    }

    return responseData.data;
  } catch (error) {
    console.error('Super Admin Dashboard error:', error);
    throw error;
  }
};
