import { authManager } from './auth-manager';
import { API_ENDPOINTS } from './api';
import { toast } from 'react-toastify';

/**
 * Strict API Client with auto-refresh and inactivity detection
 */

type RequestQueueItem = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
};

let isRefreshing = false;
let failedQueue: RequestQueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Force a clean logout and redirect to login
 */
export const forceLogout = async (message?: string) => {
  const token = authManager.getAccessToken();
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const logoutEndpoint = userRole === 'SUPER_ADMIN' 
    ? API_ENDPOINTS.auth.superAdmin.logout 
    : API_ENDPOINTS.auth.schoolAdmin.logout;
  
  // Attempt to notify backend
  if (token) {
    try {
      const refreshToken = authManager.getRefreshToken();
      await fetch(logoutEndpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (err) {
      console.warn('Backend logout failed', err);
    }
  }

  authManager.clearTokens();
  
  if (typeof window !== 'undefined') {
    if (message) {
      localStorage.setItem('logout_reason', message);
    }
    // Final hard redirect to clear all states and stop all timers
    // Determine redirect based on role
    if (userRole === 'SUPER_ADMIN') {
      window.location.href = '/super-admin/login';
    } else if (!window.location.pathname.startsWith('/super-admin')) {
      window.location.href = '/school/login';
    }
  }
};

/**
 * Enhanced fetch wrapper with security interceptors
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = authManager.getAccessToken();

  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  headers.set('Accept', 'application/json');

  let response = await fetch(url, { ...options, headers });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    const data = await response.clone().json().catch(() => ({}));
    const errorMessage = data.message || '';

    // STRICT: Handle backend-signaled inactivity or session termination
    if (errorMessage.includes('Inactive logout') || errorMessage.includes('Session expired')) {
      forceLogout('Session expired due to inactivity');
      throw new Error('Inactivity Logout');
    }

    // Attempt Silent Refresh for regular token expiry
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = authManager.getRefreshToken();
      const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
      const refreshEndpoint = userRole === 'SUPER_ADMIN' 
        ? API_ENDPOINTS.auth.superAdmin.refresh 
        : API_ENDPOINTS.auth.schoolAdmin.refresh;

      if (!refreshToken) {
        forceLogout('Session expired. Please log in again.');
        throw new Error('No refresh token');
      }

      try {
        const refreshResponse = await fetch(refreshEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!refreshResponse.ok) throw new Error('Refresh failed');

        const refreshData = await refreshResponse.json();
        const payload = refreshData.data || refreshData;
        const newAccess = payload.access_token || payload.accessToken;

        if (!newAccess) throw new Error('Invalid refresh response');

        // API only returns new access_token; keep existing refresh token
        const existingRefresh = authManager.getRefreshToken()!;
        authManager.setTokens(newAccess, existingRefresh);
        localStorage.setItem('authToken', newAccess);
        
        isRefreshing = false;
        processQueue(null, newAccess);

        // Retry original request
        headers.set('Authorization', `Bearer ${newAccess}`);
        return fetch(url, { ...options, headers });

      } catch (err) {
        isRefreshing = false;
        processQueue(new Error('Refresh failed'));
        forceLogout('Session expired. Please log in again.');
        throw err;
      }
    } else {
      // Queue current request while refresh is in progress
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            headers.set('Authorization', `Bearer ${token}`);
            resolve(fetch(url, { ...options, headers }));
          },
          reject: (err: any) => reject(err),
        });
      });
    }
  }

  return response;
}
