/**
 * Central API Configuration
 */

// Base API URL from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

// Central API Configuration
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication endpoints (new structure)
  auth: {
    schoolAdmin: {
      login:   `${API_BASE_URL}/v1/auth/schooladmin/login`,
      refresh: `${API_BASE_URL}/v1/auth/schooladmin/refresh`,
      logout:  `${API_BASE_URL}/v1/auth/schooladmin/logout`,
      forgotPassword: `${API_BASE_URL}/v1/auth/schooladmin/forgot-password`,
      validateToken: `${API_BASE_URL}/v1/auth/schooladmin/validate-token`,
      resetPassword: `${API_BASE_URL}/v1/auth/student/reset-password`,
    },
    superAdmin: {
      login:   `${API_BASE_URL}/v1/auth/superadmin/login`,
      refresh: `${API_BASE_URL}/v1/auth/superadmin/refresh`,
      logout:  `${API_BASE_URL}/v1/auth/superadmin/logout`,
      me:      `${API_BASE_URL}/v1/auth/superadmin/me`,
      forgotPassword: `${API_BASE_URL}/v1/auth/superadmin/forgot-password`,
      verifyOtp:      `${API_BASE_URL}/v1/auth/superadmin/verify-otp`,
      validateToken:  `${API_BASE_URL}/v1/auth/superadmin/validate-token`,
      resetPassword:   `${API_BASE_URL}/v1/auth/superadmin/reset-password`,
      dashboard: `${API_BASE_URL}/v1/superadmin/dashboard`,
    },
    configurationAdmin: {
      login:   `${API_BASE_URL}/v1/auth/config-admin/login`,
      refresh: `${API_BASE_URL}/v1/auth/config-admin/refresh`,
      logout:  `${API_BASE_URL}/v1/auth/config-admin/logout`,
      forgotPassword: `${API_BASE_URL}/v1/auth/config-admin/forgot-password`,
      verifyOtp:      `${API_BASE_URL}/v1/auth/config-admin/verify-otp`,
      validateToken:  `${API_BASE_URL}/v1/auth/config-admin/validate-token`,
      resetPassword:   `${API_BASE_URL}/v1/auth/config-admin/reset-password`,
    },
    teacher: {
      login: `${API_BASE_URL}/v1/auth/teacher/login`,
    },
    student: {
      login: `${API_BASE_URL}/v1/auth/student/login`,
    },
  },

  // Legacy/Alias for compatibility
  superAdmin: {
    login:   `${API_BASE_URL}/v1/auth/superadmin/login`,
    me:      `${API_BASE_URL}/v1/auth/superadmin/me`,
    forgotPassword: `${API_BASE_URL}/v1/auth/superadmin/forgot-password`,
    verifyOtp:      `${API_BASE_URL}/v1/auth/superadmin/verify-otp`,
    validateToken:  `${API_BASE_URL}/v1/auth/superadmin/validate-token`,
    resetPassword:   `${API_BASE_URL}/v1/auth/superadmin/reset-password`,
    dashboard: `${API_BASE_URL}/v1/superadmin/dashboard`,
  },
  configurationAdmin: {
    login:   `${API_BASE_URL}/v1/auth/configurationadmin/login`,
    forgotPassword: `${API_BASE_URL}/v1/auth/configurationadmin/forgot-password`,
    verifyOtp:      `${API_BASE_URL}/v1/auth/configurationadmin/verify-otp`,
    validateToken:  `${API_BASE_URL}/v1/auth/configurationadmin/validate-token`,
    resetPassword:   `${API_BASE_URL}/v1/auth/configurationadmin/reset-password`,
  },

  // Global Master data endpoints
  globalSubjects: {
    base:  `${API_BASE_URL}/v1/admin/global-subjects`,
    byId:  (id: string) => `${API_BASE_URL}/v1/admin/global-subjects/${id}`,
  },
  globalTerms: {
    base:  `${API_BASE_URL}/v1/admin/global-terms`,
    byId:  (id: string) => `${API_BASE_URL}/v1/admin/global-terms/${id}`,
  },
  
  // Dashboard endpoints
  dashboard: {
    schoolAdmin: `${API_BASE_URL}/dashboard/school-admin`,
    subAdmin: `${API_BASE_URL}/dashboard/sub-admin`,
    student: `${API_BASE_URL}/dashboard/student`,
    adminModules: `${API_BASE_URL}/v1/admin/dashboard`,
    stats: `${API_BASE_URL}/v1/admin/stats`,
    analytics: `${API_BASE_URL}/v1/admin/analytics`,
  },

  // User Management
  admin: {
    schoolUsers: `${API_BASE_URL}/admin/school/users`,
    sidebar: `${API_BASE_URL}/v1/admin/sidebar`,
  },

  // School endpoints
  schools: {
    base: `${API_BASE_URL}/v1/admin/schools`,
    getById: (id: string) => `${API_BASE_URL}/v1/admin/schools/${id}`,
    onboard: `${API_BASE_URL}/v1/admin/schools/onboard`,
    update: (id: string) => `${API_BASE_URL}/v1/admin/schools/${id}`,
    updateStatus: (id: string) => `${API_BASE_URL}/v1/admin/schools/${id}/status`,
    modules: `${API_BASE_URL}/v1/admin/schools/modules`,
    updateModules: (id: string) => `${API_BASE_URL}/v1/admin/schools/${id}/modules`,
  },

  // School POC endpoints
  schoolPocs: {
    base: (schoolId?: string) => schoolId ? `${API_BASE_URL}/admin/schools/${schoolId}/pocs` : `${API_BASE_URL}/admin/school-pocs`,
    getById: (id: string) => `${API_BASE_URL}/admin/school-pocs/${id}`,
    update: (id: string) => `${API_BASE_URL}/admin/school-pocs/${id}`,
    delete: (id: string) => `${API_BASE_URL}/admin/school-pocs/${id}`,
  },

  // Config Admin endpoints
  configAdmins: {
    base: (schoolId?: string) => schoolId ? `${API_BASE_URL}/admin/schools/${schoolId}/config-admins` : `${API_BASE_URL}/v1/admin/config-admins`,
    getById: (id: string) => `${API_BASE_URL}/v1/admin/config-admins/${id}`,
    update: (id: string) => `${API_BASE_URL}/v1/admin/config-admins/${id}`,
    updateStatus: (id: string, status: string) => `${API_BASE_URL}/v1/admin/config-admins/${id}/status?status=${status}`,
    terminate: (id: string) => `${API_BASE_URL}/v1/admin/config-admins/${id}/terminate`,
    delete: (id: string) => `${API_BASE_URL}/v1/admin/config-admins/${id}`,
    history: (adminId: string) => `${API_BASE_URL}/v1/admin/config-admins/${adminId}/history`,
  },

  // Super Sub Admin endpoints
  superSubAdmins: {
    base: `${API_BASE_URL}/v1/admin/super-sub-admins`,
    getById: (id: string) => `${API_BASE_URL}/v1/admin/super-sub-admins/${id}`,
    update: (id: string) => `${API_BASE_URL}/v1/admin/super-sub-admins/${id}`,
    delete: (id: string) => `${API_BASE_URL}/v1/admin/super-sub-admins/${id}`,
  },

  // Sub Groups endpoints
  subGroups: {
    base: (classId?: string) => classId ? `${API_BASE_URL}/v1/admin/classes/${classId}/sub-groups` : `${API_BASE_URL}/v1/admin/sub-groups`,
    update: (id: string) => `${API_BASE_URL}/v1/admin/sub-groups/${id}`,
    delete: (id: string) => `${API_BASE_URL}/v1/admin/sub-groups/${id}`,
  },

  // Staff endpoints
  staff: {
    base: `${API_BASE_URL}/v1/schooladmin/staff`,
    status: (id: string) => `${API_BASE_URL}/v1/schooladmin/staff/${id}/status`,
  },

  // School Admins endpoints
  schoolAdmins: {
    base:    (schoolId: string)                  => `${API_BASE_URL}/v1/admin/schools/${schoolId}/admins`,
    byId:    (schoolId: string, adminId: string) => `${API_BASE_URL}/v1/admin/schools/${schoolId}/admins/${adminId}`,
    status:  (schoolId: string, adminId: string) => `${API_BASE_URL}/v1/admin/schools/${schoolId}/admins/${adminId}/status`,
    history: (schoolId: string, adminId: string) => `${API_BASE_URL}/v1/admin/schools/${schoolId}/admins/${adminId}/history`,
  },

  // User endpoints
  user: {
    me: `${API_BASE_URL}/v1/user/@me`,
    permissions: (userId: string) => `${API_BASE_URL}/v1/users/${userId}/permissions`,
    modulesAccess: `${API_BASE_URL}/v1/user/modules-access`,
  },

  // Legacy User endpoint compatibility
  users: {
    permissions: (userId: string) => `${API_BASE_URL}/v1/users/${userId}/permissions`,
  },

  // Sessions endpoints
  sessions: {
    base: (schoolId?: string) => schoolId ? `${API_BASE_URL}/v1/admin/schools/${schoolId}/sessions` : `${API_BASE_URL}/v1/admin/sessions`,
    getById: (id: string) => `${API_BASE_URL}/v1/admin/sessions/${id}`,
    update: (id: string) => `${API_BASE_URL}/v1/admin/sessions/${id}`,
    delete: (id: string) => `${API_BASE_URL}/v1/admin/sessions/${id}`,
  },

  // Classes endpoints
  classes: {
    base: (schoolId?: string) => schoolId ? `${API_BASE_URL}/v1/admin/schools/${schoolId}/classes` : `${API_BASE_URL}/v1/admin/classes`,
    getById: (id: string) => `${API_BASE_URL}/v1/admin/classes/${id}`,
    update: (id: string) => `${API_BASE_URL}/v1/admin/classes/${id}`,
    delete: (id: string) => `${API_BASE_URL}/v1/admin/classes/${id}`,
    subjects: (classId: string) => `${API_BASE_URL}/v1/admin/classes/${classId}/subjects`,
    subGroups: (classId: string) => `${API_BASE_URL}/v1/admin/classes/${classId}/sub-groups`,
  },

  // Subjects endpoints
  subjects: {
    base: (schoolId?: string) => schoolId ? `${API_BASE_URL}/v1/admin/schools/${schoolId}/subjects` : `${API_BASE_URL}/v1/admin/subjects`,
    update: (id: string) => `${API_BASE_URL}/v1/admin/subjects/${id}`,
    delete: (id: string) => `${API_BASE_URL}/v1/admin/subjects/${id}`,
  },

  // Students endpoints
  students: {
    base: `${API_BASE_URL}/v1/schooladmin/students`,
    config: `${API_BASE_URL}/v1/schooladmin/students/config`,
    byId: (id: string) => `${API_BASE_URL}/v1/schooladmin/students/${id}`,
  },

  // Enquiries endpoints
  enquiries: {
    base: `${API_BASE_URL}/v1/schooladmin/enquiries`,
    checkDuplicate: `${API_BASE_URL}/v1/schooladmin/enquiries/check-duplicate`,
    byId: (id: string) => `${API_BASE_URL}/v1/schooladmin/enquiries/${id}`,
    status: (id: string) => `${API_BASE_URL}/v1/schooladmin/enquiries/${id}/status`,
    star: (id: string) => `${API_BASE_URL}/v1/schooladmin/enquiries/${id}/star`,
    archive: (id: string) => `${API_BASE_URL}/v1/schooladmin/enquiries/${id}/archive`,
    visits: (id: string) => `${API_BASE_URL}/v1/schooladmin/enquiries/${id}/visits`,
    enquirers: (id: string) => `${API_BASE_URL}/v1/schooladmin/enquiries/${id}/enquirers`,
    followUp: (id: string) => `${API_BASE_URL}/v1/schooladmin/enquiries/${id}/follow-up`,
    logs: (id: string) => `${API_BASE_URL}/v1/schooladmin/enquiries/${id}/logs`,
    update: (id: string) => `${API_BASE_URL}/v1/schooladmin/enquiries/${id}`,
  },
  
  // Terms endpoints
  terms: {
    base: (schoolId?: string) => schoolId ? `${API_BASE_URL}/v1/school-admin/schools/${schoolId}/terms` : `${API_BASE_URL}/v1/school-admin/terms`,
    byId: (id: string) => `${API_BASE_URL}/v1/school-admin/terms/${id}`,
    update: (id: string) => `${API_BASE_URL}/v1/school-admin/terms/${id}`,
    delete: (id: string) => `${API_BASE_URL}/v1/school-admin/terms/${id}`,
  },

  // Timetable endpoints
  timetable: {
    base: (schoolId?: string) => schoolId ? `${API_BASE_URL}/v1/school-admin/schools/${schoolId}/timetable` : `${API_BASE_URL}/v1/school-admin/timetable`,
    byId: (id: string) => `${API_BASE_URL}/v1/school-admin/timetable/${id}`,
    publish: (id: string) => `${API_BASE_URL}/v1/school-admin/timetable/${id}/publish`,
    logs: (id: string) => `${API_BASE_URL}/v1/school-admin/timetable/${id}/logs`,
    subjects: {
      base: (schoolId?: string) => schoolId ? `${API_BASE_URL}/v1/school-admin/schools/${schoolId}/timetable/subjects` : `${API_BASE_URL}/v1/school-admin/timetable/subjects`,
      byId: (id: string) => `${API_BASE_URL}/v1/school-admin/timetable/subjects/${id}`,
    },
  },
} as const;

export interface DashboardResponse {
  role: string;
  message: string;
  features: string[];
}

import { authManager } from './auth-manager';
import { forceLogout } from './api-client';

export const getAuthHeader = (): Record<string, string> => {
  const token = authManager.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Check an API response and throw a user-friendly error for common status codes.
 * Call this after every fetch() instead of manually checking response.ok.
 */
export async function handleApiError(response: Response, fallbackMessage: string): Promise<never> {
  if (response.status === 403) {
    throw new Error("You don't have access to this resource.");
  }
  if (response.status === 401) {
    const data = await response.clone().json().catch(() => ({}));
    const msg = data.message || 'Session expired. Please log in again.';
    forceLogout(msg);
    throw new Error(msg);
  }
  const err = await response.json().catch(() => ({ message: fallbackMessage }));
  throw new Error(err.message || `Error ${response.status}`);
}
