import { cookieManager, SUPER_ADMIN_COOKIE_KEYS, SCHOOL_ADMIN_COOKIE_KEYS } from '@/lib/cookie-manager';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const authManager = {
  /**
   * Store tokens securely in localStorage and sync with cookies
   */
  setTokens(accessToken: string, refreshToken: string, role?: string): void {
    if (typeof window === 'undefined') return;
    
    // Primary storage
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    // Compatibility key
    localStorage.setItem('authToken', accessToken);

    // Sync with cookies based on role if provided
    if (role) {
      const isSuperAdmin = role === 'SUPER_ADMIN' || role === 'CONFIGURATION_ADMIN';
      const cookieKeys = isSuperAdmin ? SUPER_ADMIN_COOKIE_KEYS : SCHOOL_ADMIN_COOKIE_KEYS;
      
      cookieManager.set(cookieKeys.access, accessToken);
      cookieManager.set(cookieKeys.refresh, refreshToken);
    }
  },

  /**
   * Retrieve the current access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Retrieve the current refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Clear all tokens and storage data
   */
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    // Clear LocalStorage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('schoolId');
    localStorage.removeItem('logout_reason');

    // Clear Cookies
    cookieManager.remove(SUPER_ADMIN_COOKIE_KEYS.access);
    cookieManager.remove(SUPER_ADMIN_COOKIE_KEYS.refresh);
    cookieManager.remove(SCHOOL_ADMIN_COOKIE_KEYS.access);
    cookieManager.remove(SCHOOL_ADMIN_COOKIE_KEYS.refresh);
  },

  /**
   * Quick check if the user has tokens
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  },
};
