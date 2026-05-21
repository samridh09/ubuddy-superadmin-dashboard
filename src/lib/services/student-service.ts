import { API_ENDPOINTS, handleApiError } from '@/lib/api';
import { fetchWithAuth } from '@/lib/api-client';
import type { PagedResult } from '@/types/pagination';
import { extractPaginationMeta } from '@/types/pagination';
import type {
  StudentFormConfig,
  StudentProfile,
  OnboardStudentResponse,
  UpdateStudentFormConfigPayload,
} from '@/types/student';

export type StudentListItem = {
  id: string;
  studentIdCustom?: string;
  name?: string;
  gender?: string;
  admissionType?: string;
  primaryMobileNumber?: string;
  emailAddress?: string;
  createdAt?: string;
  className?: string;
  [key: string]: unknown;
};

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
});

const multipartHeaders = () => ({} as Record<string, string>); // Let fetch set Content-Type for multipart

async function parseApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

function isBooleanMap(value: unknown): value is Record<string, boolean> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.values(value as Record<string, unknown>).every((v) => typeof v === 'boolean');
}

function toStudentFormConfig(value: unknown): StudentFormConfig {
  if (value && typeof value === 'object' && 'config' in (value as Record<string, unknown>)) {
    const obj = value as Record<string, unknown>;
    const cfg = obj.config;
    if (isBooleanMap(cfg)) {
      return {
        id: typeof obj.id === 'string' ? obj.id : undefined,
        schoolId: typeof obj.schoolId === 'string' ? obj.schoolId : undefined,
        updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : undefined,
        config: cfg,
      };
    }
  }

  if (isBooleanMap(value)) {
    return { config: value };
  }

  return { config: {} };
}

function toStudentList(value: unknown): StudentListItem[] {
  const source =
    value && typeof value === 'object' && 'data' in (value as Record<string, unknown>)
      ? (value as Record<string, unknown>).data
      : value;

  const items =
    Array.isArray(source)
      ? source
      : source && typeof source === 'object' && Array.isArray((source as Record<string, unknown>).data)
        ? (source as Record<string, unknown>).data
        : [];

  return (items as unknown[])
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => ({
      id: String(item.id ?? ''),
      studentIdCustom:
        typeof item.student_id_custom === 'string'
          ? item.student_id_custom
          : typeof item.studentIdCustom === 'string'
            ? item.studentIdCustom
            : undefined,
      name: typeof item.name === 'string' ? item.name : undefined,
      gender: typeof item.gender === 'string' ? item.gender : undefined,
      admissionType: typeof item.admissionType === 'string' ? item.admissionType : undefined,
      primaryMobileNumber:
        typeof item.primaryMobileNumber === 'string'
          ? item.primaryMobileNumber
          : undefined,
      emailAddress: typeof item.emailAddress === 'string' ? item.emailAddress : undefined,
      createdAt:
        typeof item.createdAt === 'string'
          ? item.createdAt
          : undefined,
      className:
        typeof item.className === 'string'
          ? item.className
          : typeof item.class_name === 'string'
            ? item.class_name
            : undefined,
      ...item,
    }))
    .filter((item) => item.id.length > 0);
}

export const studentService = {
  async getStudentFormConfig(): Promise<StudentFormConfig> {
    const response = await fetchWithAuth(API_ENDPOINTS.students.config, {
      method: 'GET',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch student form config');
    }

    const data = await parseApiResponse<{ data?: unknown } | StudentFormConfig | Record<string, boolean>>(response);
    const raw = data && typeof data === 'object' && 'data' in data ? data.data : data;
    return toStudentFormConfig(raw);
  },

  async updateStudentFormConfig(payload: UpdateStudentFormConfigPayload | Record<string, boolean>): Promise<StudentFormConfig> {
    const requestBody = 'config' in payload ? payload.config : payload;

    const response = await fetchWithAuth(API_ENDPOINTS.students.config, {
      method: 'PATCH',
      headers: jsonHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to update student form config');
    }

    const data = await parseApiResponse<{ data?: unknown } | StudentFormConfig | Record<string, boolean>>(response);
    const raw = data && typeof data === 'object' && 'data' in data ? data.data : data;
    return toStudentFormConfig(raw);
  },

  async onboardStudent(formData: FormData): Promise<OnboardStudentResponse> {
    const response = await fetchWithAuth(API_ENDPOINTS.students.base, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to onboard student');
    }

    const data = await parseApiResponse<{ data?: OnboardStudentResponse } | OnboardStudentResponse>(response);
    return (data && typeof data === 'object' && 'data' in data && data.data ? data.data : data) as OnboardStudentResponse;
  },

  async getStudentProfile(id: string): Promise<StudentProfile> {
    const response = await fetchWithAuth(API_ENDPOINTS.students.byId(id), {
      method: 'GET',
      headers: jsonHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch student profile');
    }

    const data = await parseApiResponse<{ data?: StudentProfile } | StudentProfile>(response);
    return (data && typeof data === 'object' && 'data' in data && data.data ? data.data : data) as StudentProfile;
  },

  async getAllStudents(): Promise<StudentListItem[]> {
    const response = await fetchWithAuth(API_ENDPOINTS.students.base, {
      method: 'GET',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch students');
    }

    const data = await parseApiResponse<unknown>(response);
    return toStudentList(data);
  },

  async getStudentsPage(page: number, limit: number, search?: string): Promise<PagedResult<StudentListItem>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search?.trim()) params.set('search', search.trim());
    const response = await fetchWithAuth(`${API_ENDPOINTS.students.base}?${params}`, {
      method: 'GET',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch students');
    }

    const payload = await parseApiResponse<unknown>(response);
    const data = toStudentList(payload);
    const pagination = extractPaginationMeta(payload, data.length);
    return { data, pagination };
  },

  // Backward-compatible aliases used by existing UI code
  async getFormConfig(): Promise<StudentFormConfig> {
    return this.getStudentFormConfig();
  },

  async updateFormConfig(config: Record<string, boolean>): Promise<StudentFormConfig> {
    return this.updateStudentFormConfig({ config });
  },

  async getProfile(id: string): Promise<StudentProfile> {
    return this.getStudentProfile(id);
  },
};
