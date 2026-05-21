'use client';

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '@/lib/api';
import { authManager } from '@/lib/auth-manager';
import { forceLogout } from '@/lib/api-client';

/**
 * Axios Client with Strict Security Interceptors
 * Handles auto-refreshing of tokens and request queuing.
 */

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ── Request Interceptor ─────────────────────────────────────────────────────

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────────────────────

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is not 401 or has no config, reject immediately
    if (error.response?.status !== 401 || !originalRequest) {
      const backendMessage = (error.response?.data as any)?.message;
      if (backendMessage) {
        error.message = backendMessage;
      }
      return Promise.reject(error);
    }

    // Handle strict backend signals for inactivity or expired session
    const errorData = error.response.data as any;
    const errorMessage = errorData?.message || '';

    if (errorMessage.includes('Inactive logout') || errorMessage.includes('Session expired')) {
      forceLogout('Session expired due to inactivity');
      return Promise.reject(error);
    }

    // If refresh token request itself fails with 401
    if (originalRequest.url?.includes('/refresh')) {
      forceLogout('Session expired. Please log in again.');
      return Promise.reject(error);
    }

    // Prevent infinite loops
    if (originalRequest._retry) {
      forceLogout('Session expired. Please log in again.');
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = authManager.getRefreshToken();
    const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    const refreshEndpoint = userRole === 'SUPER_ADMIN'
      ? API_ENDPOINTS.auth.superAdmin.refresh
      : userRole === 'CONFIGURATION_ADMIN'
        ? API_ENDPOINTS.auth.configurationAdmin.refresh
        : API_ENDPOINTS.auth.schoolAdmin.refresh;

    if (!refreshToken) {
      forceLogout('Session expired. Please log in again.');
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(refreshEndpoint, {
        refresh_token: refreshToken,
      });

      // API structure might vary, handle both data.data and data
      const payload = data.data || data;
      const newAccessToken = payload.access_token || payload.accessToken;
      const newRefreshToken = payload.refresh_token || payload.refreshToken;

      if (!newAccessToken) throw new Error('Token refresh failed');

      // Update tokens and sync cookies
      authManager.setTokens(newAccessToken, newRefreshToken || refreshToken, userRole || undefined);
      
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);
      
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);
      forceLogout('Session expired. Please log in again.');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;
