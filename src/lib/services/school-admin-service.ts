import type { SchoolAdmin, CreateSchoolAdminPayload, UpdateSchoolAdminPayload } from '@/types/school-admin';
import { API_ENDPOINTS } from '@/lib/api';
import axiosClient from '@/lib/axios';

/**
 * School Admin Service using Axios with Auth Interceptors
 */
export const schoolAdminService = {
  async getAll(schoolId: string): Promise<SchoolAdmin[]> {
    const { data } = await axiosClient.get(API_ENDPOINTS.schoolAdmins.base(schoolId));
    return data.data || data || [];
  },

  async getById(schoolId: string, adminId: string): Promise<SchoolAdmin> {
    const { data } = await axiosClient.get(API_ENDPOINTS.schoolAdmins.byId(schoolId, adminId));
    return data.data || data;
  },

  async create(schoolId: string, payload: CreateSchoolAdminPayload): Promise<SchoolAdmin> {
    const { data } = await axiosClient.post(API_ENDPOINTS.schoolAdmins.base(schoolId), payload);
    return data.data || data;
  },

  async update(schoolId: string, adminId: string, payload: UpdateSchoolAdminPayload): Promise<SchoolAdmin> {
    const { data } = await axiosClient.put(API_ENDPOINTS.schoolAdmins.byId(schoolId, adminId), payload);
    return data.data || data;
  },

  async delete(schoolId: string, adminId: string): Promise<void> {
    await axiosClient.delete(API_ENDPOINTS.schoolAdmins.byId(schoolId, adminId));
  },
};
