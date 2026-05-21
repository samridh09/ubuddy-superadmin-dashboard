/**
 * Dashboard API Integration
 */

import { API_ENDPOINTS, API_CONFIG, getAuthHeader } from '../api';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  growth: {
    users: number;
    revenue: number;
  };
}

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message: string;
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  message: string;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.dashboard.stats, {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }

    return data;
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
};

/**
 * Get analytics data
 */
export const getAnalytics = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<AnalyticsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `${API_ENDPOINTS.dashboard.analytics}${
      queryParams.toString() ? `?${queryParams}` : ''
    }`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        ...getAuthHeader(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch analytics');
    }

    return data;
  } catch (error) {
    console.error('Get analytics error:', error);
    throw error;
  }
};
