/**
 * Central API Export File
 * Import all API modules here for easy access
 */

// Shared Types
export * from './types';

// API Configuration
export * from './api';

// Super Admin Authentication
export * from './authentication/super-admin-auth';

// Users Module (Keeping for management purposes if needed, otherwise could be removed)
// export { getUserProfile, updateUserProfile } from './users/profile'; // Likely generic user profile, commenting out/removing
// export type { User, UpdateProfileRequest, UserResponse } from './users/profile'; // Likely generic user profile
// export { getAllUsers, getUserById, deleteUser } from './users/management';
// export type { UsersListResponse, UserByIdResponse, DeleteUserResponse } from './users/management';

// Dashboard Module
// export { getDashboardStats, getAnalytics } from './dashboard/stats'; // Check if this is super admin or generic. API endpoints suggested generic. 
// export type { DashboardStats, AnalyticsData, DashboardStatsResponse, AnalyticsResponse } from './dashboard/stats';

// Super Admin Dashboard
export * from './dashboard/super-admin-dashboard';

// Export organized modules for named imports
export * as SuperAdminAuthAPI from './authentication/super-admin-auth';
// export * as UsersAPI from './users/management';
export * as SuperAdminDashboardAPI from './dashboard/super-admin-dashboard';
