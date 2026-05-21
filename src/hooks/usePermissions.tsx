'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

import { userService } from '@/lib/services/user-service';
import { getCurrentUserModuleAccess, type ModuleAccessResponse } from '@/lib/services/user-permission-service';
import type { UserProfile, UserRole } from '@/types/user';

type PermissionAction = 'READ' | 'WRITE' | 'UPDATE' | 'MANAGE' | 'EXPORT';

const MODULE_ALIASES: Record<string, string[]> = {
  attendance: ['attendance'],
  classes: ['classes', 'academics'],
  sessions: ['sessions', 'academics'],
  'user-management': ['user-management', 'staff'],
  schools: ['schools', 'school-admins'],
  students: ['students', 'student-management'],
  teachers: ['teachers', 'staff'],
  reports: ['reports', 'enquiries'],
  subjects: ['subjects'],
  timetable: ['timetable'],
  // Backward-compatible aliases
  staff: ['staff', 'user-management', 'teachers'],
  'student-management': ['student-management', 'students'],
  academics: ['academics', 'classes', 'sessions', 'subjects'],
  enquiries: ['enquiries', 'reports'],
};

interface PermissionContextValue {
  user: UserProfile | null;
  loading: boolean;
  /** Check if user has actual permissions on a module (non-empty permissions array) */
  hasModule: (moduleName: string) => boolean;
  /** Check if module is returned by the API — shows in sidebar even if permissions are empty */
  isModuleVisible: (moduleName: string) => boolean;
  /** Check if user has a specific permission on a module */
  hasPermission: (moduleName: string, action: PermissionAction) => boolean;
  /** Check if the module or any of its children is accessible in the access tree */
  canAccessModule: (moduleName: string) => boolean;
  /** Check if user's role matches */
  isRole: (...roles: UserRole[]) => boolean;
  /** All permissions from API including empty-array modules */
  permissions: Record<string, string[]> | null;
  /** Access tree from /v1/user/modules/access */
  moduleAccess: ModuleAccessResponse | null;
  /** Refresh user data from API */
  refresh: () => Promise<void>;
}

export const PermissionContext = createContext<PermissionContextValue | null>(null);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<Record<string, string[]> | null>(null);
  const [moduleAccess, setModuleAccess] = useState<ModuleAccessResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch the primary user profile first
      const userData = await userService.getCurrentUser();
      setUser(userData);

      if (userData) {
        // 2. Attempt to fetch extra permission data, but don't fail if they error out
        // Some endpoints (like /v1/admin/dashboard) may not be intended for all roles.
        try {
          const [modulesData, accessData] = await Promise.all([
            userService.getUserModules().catch(() => null),
            getCurrentUserModuleAccess().catch(() => null),
          ]);

          if (modulesData?.modules?.length) {
            // Store ALL modules from API, including those with empty permissions
            const permsFromModules: Record<string, string[]> = {};
            for (const m of modulesData.modules) {
              permsFromModules[m.name] = m.permissions;
            }
            setPermissions(permsFromModules);
          } else {
            // Fallback to permissions attached to the user object
            setPermissions(userData.module_permissions || null);
          }

          setModuleAccess(accessData);
        } catch (auxError) {
          console.warn('Non-critical error fetching auxiliary permission data:', auxError);
          // Fallback to basic module permissions from user object
          setPermissions(userData.module_permissions || null);
          setModuleAccess(null);
        }
      } else {
        setPermissions(null);
        setModuleAccess(null);
      }
    } catch (criticalError) {
      console.error('Critical error loading user permissions:', criticalError);
      setUser(null);
      setPermissions(null);
      setModuleAccess(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const getModuleActions = useCallback(
    (moduleName: string): string[] => {
      const source = permissions !== null ? permissions : user?.module_permissions;
      if (!source) return [];

      const keys = MODULE_ALIASES[moduleName] ?? [moduleName];
      const merged = keys.flatMap((key) => (Array.isArray(source[key]) ? source[key] : []));
      return Array.from(new Set(merged.map((perm) => perm.toUpperCase())));
    },
    [user, permissions],
  );

  /** True only if the module has at least one permission */
  const hasModule = useCallback(
    (moduleName: string): boolean => getModuleActions(moduleName).length > 0,
    [getModuleActions],
  );

  /** True if the module was returned by the API (visible in sidebar regardless of permissions) */
  const isModuleVisible = useCallback(
    (moduleName: string): boolean => {
      if (!permissions) return false;
      const keys = MODULE_ALIASES[moduleName] ?? [moduleName];
      return keys.some((key) => key in permissions);
    },
    [permissions],
  );

  const hasPermission = useCallback(
    (moduleName: string, action: PermissionAction): boolean => {
      const upper = action.toUpperCase();
      return getModuleActions(moduleName).includes(upper);
    },
    [getModuleActions],
  );

  const canAccessModule = useCallback(
    (moduleName: string): boolean => {
      const entry = moduleAccess?.[moduleName];
      if (!entry) return false;
      if (entry.access === true) return true;

      const modules = entry.modules;
      if (!modules) return false;
      return Object.values(modules).some((child) => child.access === true);
    },
    [moduleAccess],
  );

  const isRole = useCallback(
    (...roles: UserRole[]): boolean => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user],
  );

  return (
    <PermissionContext.Provider
      value={{
        user,
        loading,
        hasModule,
        isModuleVisible,
        hasPermission,
        canAccessModule,
        isRole,
        permissions,
        moduleAccess,
        refresh: loadUser,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return ctx;
}
