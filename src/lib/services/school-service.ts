import { API_ENDPOINTS } from '../api';
import axiosClient from '../axios';
import type { School, SchoolProfilePayload, SchoolModulesResponse } from '@/types/school';

// Types live in src/types/school.ts — re-exported here for backward compatibility
export type {
  SchoolAddress,
  SchoolPOC,
  School,
  SchoolProfilePayload,
  SchoolModule,
  SchoolModulesResponse,
} from '@/types/school';

export const getAllSchools = async (): Promise<School[]> => {
  const { data: responseData } = await axiosClient.get(API_ENDPOINTS.schools.base);
  return responseData.data as School[];
};

export const getSchoolById = async (id: string): Promise<School> => {
  const { data: responseData } = await axiosClient.get(API_ENDPOINTS.schools.getById(id));
  return responseData.data as School;
};

export const updateSchoolStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<School> => {
  const { data: responseData } = await axiosClient.patch(API_ENDPOINTS.schools.updateStatus(id), { status });
  return responseData.data as School;
};

export const updateSchool = async (id: string, payload: Partial<Pick<School, 'total_students_limit' | 'total_sub_admins_limit'>>): Promise<School> => {
  const { data: responseData } = await axiosClient.put(API_ENDPOINTS.schools.update(id), payload);
  return responseData.data as School;
};

export const updateSchoolProfile = async (id: string, payload: Partial<SchoolProfilePayload> | Record<string, unknown>): Promise<School> => {
  const { data: responseData } = await axiosClient.put(API_ENDPOINTS.schools.update(id), payload);
  return responseData.data as School;
};

export const getSchoolModules = async (): Promise<SchoolModulesResponse> => {
  const { data: responseData } = await axiosClient.get(API_ENDPOINTS.schools.modules);
  return responseData.data as SchoolModulesResponse;
};

export const updateSchoolModules = async (schoolId: string, modules: string[]): Promise<School> => {
  const { data: responseData } = await axiosClient.patch(API_ENDPOINTS.schools.updateModules(schoolId), { modules });
  return responseData.data as School;
};
