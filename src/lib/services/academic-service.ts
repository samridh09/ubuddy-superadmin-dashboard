import { API_ENDPOINTS, getAuthHeader, handleApiError } from '@/lib/api';
import type { PagedResult } from '@/types/pagination';
import { extractPaginationMeta } from '@/types/pagination';

export interface AcademicClass {
  id: string;
  name: string;
  section?: string;
  display_name?: string;
  class_enum?: string;
  school_id?: string;
  class_teacher?: string;
  student_count?: number;
  updated_at?: string;
}

export interface AcademicSubject {
  id: string;
  name: string;
  code?: string;
  school_id?: string;
  class_name?: string;
  teacher_name?: string;
  updated_at?: string;
}

interface RawAcademicClass {
  id: string;
  name?: string;
  section?: string;
  display_name?: string;
  class_enum?: string;
  school_id?: string;
  class_teacher?: string;
  student_count?: number;
  updated_at?: string;
  updatedAt?: string;
}

interface RawAcademicSubject {
  id: string;
  name?: string;
  code?: string;
  school_id?: string;
  class_name?: string;
  teacher_name?: string;
  updated_at?: string;
  updatedAt?: string;
}

const mockClasses: AcademicClass[] = [
  { id: 'cls-1', name: 'Class 1', section: 'A', class_teacher: 'N/A', student_count: 0 },
  { id: 'cls-2', name: 'Class 2', section: 'A', class_teacher: 'N/A', student_count: 0 },
];

const mockSubjects: AcademicSubject[] = [
  { id: 'sub-1', name: 'Mathematics', code: 'MATH', class_name: 'Class 1', teacher_name: 'N/A' },
  { id: 'sub-2', name: 'Science', code: 'SCI', class_name: 'Class 2', teacher_name: 'N/A' },
];

function extractListData(payload: unknown): unknown[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const topLevel = record.data ?? payload;

  if (Array.isArray(topLevel)) {
    return topLevel;
  }

  if (topLevel && typeof topLevel === 'object') {
    const nested = topLevel as Record<string, unknown>;
    if (Array.isArray(nested.data)) {
      return nested.data;
    }
    if (Array.isArray(nested.items)) {
      return nested.items;
    }
  }

  return [];
}

function normalizeClass(item: RawAcademicClass): AcademicClass {
  const displayName = item.display_name?.trim();
  const [displayClassName, displaySection] = displayName ? displayName.split(' - ') : [];
  const normalizedName =
    item.name?.trim() ||
    displayClassName?.trim() ||
    (item.class_enum ? `Class ${item.class_enum}` : 'Unnamed Class');
  const inferredSection = item.section || displaySection?.replace(/^Section\s+/i, '').trim();

  return {
    id: item.id,
    name: normalizedName,
    section: inferredSection,
    display_name: item.display_name,
    class_enum: item.class_enum,
    school_id: item.school_id,
    class_teacher: item.class_teacher,
    student_count: item.student_count,
    updated_at: item.updated_at || item.updatedAt,
  };
}

function normalizeSubject(item: RawAcademicSubject): AcademicSubject {
  return {
    id: item.id,
    name: item.name?.trim() || 'Unnamed Subject',
    code: item.code,
    school_id: item.school_id,
    class_name: item.class_name,
    teacher_name: item.teacher_name,
    updated_at: item.updated_at || item.updatedAt,
  };
}

async function parseListResponse<T>(
  response: Response,
  fallbackMessage: string,
  normalize?: (item: Record<string, unknown>) => T,
): Promise<T[]> {
  if (!response.ok) {
    await handleApiError(response, fallbackMessage);
  }

  const payload = await response.json();
  const data = extractListData(payload);

  if (!normalize) {
    return data as T[];
  }

  return data.map((item) => normalize(item as Record<string, unknown>));
}

export const academicService = {
  async getClassesPage(page: number, limit: number, search?: string): Promise<PagedResult<AcademicClass>> {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search?.trim()) params.set('search', search.trim());
      const response = await fetch(`${API_ENDPOINTS.classes.base()}?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...(getAuthHeader() as Record<string, string>) },
      });
      const payload = await response.json();
      const raw = extractListData(payload);
      const data = raw.map((item) => normalizeClass(item as unknown as RawAcademicClass));
      const pagination = extractPaginationMeta(payload, data.length);
      return { data, pagination };
    } catch (error) {
      console.error('Get classes page error:', error);
      return { data: mockClasses, pagination: { total: mockClasses.length, page: 1, limit, totalPages: 1, hasMore: false } };
    }
  },

  async getSubjectsPage(page: number, limit: number, search?: string): Promise<PagedResult<AcademicSubject>> {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search?.trim()) params.set('search', search.trim());
      const response = await fetch(`${API_ENDPOINTS.subjects.base()}?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...(getAuthHeader() as Record<string, string>) },
      });
      const payload = await response.json();
      const raw = extractListData(payload);
      const data = raw.map((item) => normalizeSubject(item as unknown as RawAcademicSubject));
      const pagination = extractPaginationMeta(payload, data.length);
      return { data, pagination };
    } catch (error) {
      console.error('Get subjects page error:', error);
      return { data: mockSubjects, pagination: { total: mockSubjects.length, page: 1, limit, totalPages: 1, hasMore: false } };
    }
  },

  async getClasses(): Promise<AcademicClass[]> {
    try {
      const response = await fetch(API_ENDPOINTS.classes.base(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthHeader() as Record<string, string>),
        },
      });

      return await parseListResponse<AcademicClass>(response, 'Failed to fetch classes', (item) =>
        normalizeClass(item as unknown as RawAcademicClass),
      );
    } catch (error) {
      console.error('Get classes error:', error);
      return mockClasses;
    }
  },

  async getSubjects(): Promise<AcademicSubject[]> {
    try {
      const response = await fetch(API_ENDPOINTS.subjects.base(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthHeader() as Record<string, string>),
        },
      });

      return await parseListResponse<AcademicSubject>(response, 'Failed to fetch subjects', (item) =>
        normalizeSubject(item as unknown as RawAcademicSubject),
      );
    } catch (error) {
      console.error('Get subjects error:', error);
      return mockSubjects;
    }
  },
};
