import type { UserProfile, UserModules } from '@/types/user';
import { API_ENDPOINTS } from '@/lib/api';
import axiosClient from '@/lib/axios';
import { authManager } from '@/lib/auth-manager';

function extractModulePermissions(payload: unknown): Record<string, string[]> | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const candidate =
    record.module_permissions ??
    (record.data && typeof record.data === 'object'
      ? (record.data as Record<string, unknown>).module_permissions ?? record.data
      : null);

  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return null;
  }

  const normalizedEntries = Object.entries(candidate).filter(([, value]) => Array.isArray(value));
  return Object.fromEntries(normalizedEntries) as Record<string, string[]>;
}

/**
 * User Service - Handles current user profile and module data using Axios
 */
export const userService = {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const { data } = await axiosClient.get(API_ENDPOINTS.user.me);
      const user = data.data || data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      
      if (typeof window !== 'undefined') {
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) return JSON.parse(cachedUser);
      }
      
      return null;
    }
  },

  /**
   * Get modules for current user
   */
  async getUserModules(): Promise<UserModules | null> {
    try {
      const { data } = await axiosClient.get(API_ENDPOINTS.dashboard.adminModules);
      return data.data || data;
    } catch (error) {
      console.error('Error fetching user modules:', error);
      return null;
    }
  },

  /**
   * Check if user has permission for a specific module and action
   */
  hasPermission(modules: UserModules | null, moduleName: string, permission: string): boolean {
    if (!modules) return false;
    const userModule = modules.modules.find(m => m.name === moduleName);
    return userModule ? userModule.permissions.includes(permission) : false;
  },

  /**
   * Update permissions for a specific user by ID
   */
  async updatePermissions(userId: string, permissions: Record<string, string[]>): Promise<void> {
    await axiosClient.patch(API_ENDPOINTS.user.permissions(userId), {
      permissions,
      module_permissions: permissions,
    });
  },

  /**
   * Get permissions for a specific user by ID
   */
  async getUserPermissions(userId: string): Promise<Record<string, string[]> | null> {
    const { data } = await axiosClient.get(API_ENDPOINTS.user.permissions(userId));
    return extractModulePermissions(data);
  },

  /**
   * Get user from localStorage (cached data)
   */
  getCachedUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear all auth data and logout
   */
  logout(): void {
    authManager.clearTokens();
  },
};
