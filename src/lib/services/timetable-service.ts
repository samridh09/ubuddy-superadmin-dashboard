import { API_ENDPOINTS, getAuthHeader, handleApiError } from '@/lib/api';

export interface Term {
  id: string;
  name: string;
  school_id?: string;
  start_date?: string;
  end_date?: string;
  session_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TimetableEntry {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  subject_id: string;
  teacher_id: string;
  class_id?: string;
}

export interface Timetable {
  id: string;
  school_id?: string;
  is_published: boolean;
  last_edited_by?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  // Nested objects returned by the API
  class?: {
    id: string;
    class_enum?: string;
    display_name?: string;
    school_id?: string;
  };
  term?: {
    id: string;
    name?: string;
    start_date?: string;
    end_date?: string;
    session_id?: string;
  };
  entries?: TimetableEntry[];
  // Used in create/update payloads
  name?: string;
  class_id?: string;
  term_id?: string;
}

export interface TimetableSubject {
  id: string;
  name: string;
  code?: string;
  color?: string;
}

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getAuthHeader() as Record<string, string>),
});

export const termsService = {
  async getTerms(): Promise<Term[]> {
    const res = await fetch(API_ENDPOINTS.terms.base(), { method: 'GET', headers: headers() });
    if (!res.ok) await handleApiError(res, 'Failed to fetch terms');
    const result = await res.json();
    return result.data || [];
  },

  async createTerm(data: Partial<Term>): Promise<Term> {
    const res = await fetch(API_ENDPOINTS.terms.base(), {
      method: 'POST', headers: headers(), body: JSON.stringify(data),
    });
    if (!res.ok) await handleApiError(res, 'Failed to create term');
    const result = await res.json();
    return result.data;
  },

  async updateTerm(id: string, data: Partial<Term>): Promise<Term> {
    const res = await fetch(API_ENDPOINTS.terms.byId(id), {
      method: 'PUT', headers: headers(), body: JSON.stringify(data),
    });
    if (!res.ok) await handleApiError(res, 'Failed to update term');
    const result = await res.json();
    return result.data;
  },

  async deleteTerm(id: string): Promise<void> {
    const res = await fetch(API_ENDPOINTS.terms.byId(id), { method: 'DELETE', headers: headers() });
    if (!res.ok) await handleApiError(res, 'Failed to delete term');
  },
};

export const timetableService = {
  async listTimetables(classId?: string, termId?: string): Promise<Timetable[]> {
    const params = new URLSearchParams();
    if (classId) params.set('class_id', classId);
    if (termId) params.set('term_id', termId);
    const url = params.toString()
      ? `${API_ENDPOINTS.timetable.base()}?${params}`
      : API_ENDPOINTS.timetable.base();
    const res = await fetch(url, { method: 'GET', headers: headers() });
    if (!res.ok) await handleApiError(res, 'Failed to list timetables');
    const result = await res.json();
    return result.data || [];
  },

  async createTimetable(data: Partial<Timetable>): Promise<Timetable> {
    const res = await fetch(API_ENDPOINTS.timetable.base(), {
      method: 'POST', headers: headers(), body: JSON.stringify(data),
    });
    if (!res.ok) await handleApiError(res, 'Failed to create timetable');
    const result = await res.json();
    return result.data;
  },

  async updateTimetable(id: string, data: Partial<Timetable>): Promise<Timetable> {
    const res = await fetch(API_ENDPOINTS.timetable.byId(id), {
      method: 'PUT', headers: headers(), body: JSON.stringify(data),
    });
    if (!res.ok) await handleApiError(res, 'Failed to update timetable');
    const result = await res.json();
    return result.data;
  },

  async getTimetable(id: string): Promise<Timetable> {
    const res = await fetch(API_ENDPOINTS.timetable.byId(id), { method: 'GET', headers: headers() });
    if (!res.ok) await handleApiError(res, 'Failed to fetch timetable');
    const result = await res.json();
    return result.data;
  },

  async deleteTimetable(id: string): Promise<void> {
    const res = await fetch(API_ENDPOINTS.timetable.byId(id), { method: 'DELETE', headers: headers() });
    if (!res.ok) await handleApiError(res, 'Failed to delete timetable');
  },

  async togglePublish(id: string, isPublished: boolean): Promise<Timetable> {
    const res = await fetch(API_ENDPOINTS.timetable.publish(id), {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ is_published: isPublished }),
    });
    if (!res.ok) await handleApiError(res, 'Failed to toggle publish status');
    const result = await res.json();
    return result.data;
  },

  async getLogs(id: string): Promise<any[]> {
    const res = await fetch(API_ENDPOINTS.timetable.logs(id), { method: 'GET', headers: headers() });
    if (!res.ok) await handleApiError(res, 'Failed to fetch timetable logs');
    const result = await res.json();
    return result.data || [];
  },

  async getSubjects(): Promise<TimetableSubject[]> {
    const res = await fetch(API_ENDPOINTS.timetable.subjects.base(), { method: 'GET', headers: headers() });
    if (!res.ok) await handleApiError(res, 'Failed to fetch subjects');
    const result = await res.json();
    return result.data || [];
  },

  async createSubject(data: Partial<TimetableSubject>): Promise<TimetableSubject> {
    const res = await fetch(API_ENDPOINTS.timetable.subjects.base(), {
      method: 'POST', headers: headers(), body: JSON.stringify(data),
    });
    if (!res.ok) await handleApiError(res, 'Failed to create subject');
    const result = await res.json();
    return result.data;
  },

  async updateSubject(id: string, data: Partial<TimetableSubject>): Promise<TimetableSubject> {
    const res = await fetch(API_ENDPOINTS.timetable.subjects.byId(id), {
      method: 'PUT', headers: headers(), body: JSON.stringify(data),
    });
    if (!res.ok) await handleApiError(res, 'Failed to update subject');
    const result = await res.json();
    return result.data;
  },

  async deleteSubject(id: string): Promise<void> {
    const res = await fetch(API_ENDPOINTS.timetable.subjects.byId(id), { method: 'DELETE', headers: headers() });
    if (!res.ok) await handleApiError(res, 'Failed to delete subject');
  },
};
