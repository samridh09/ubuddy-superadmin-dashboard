import { API_ENDPOINTS, getAuthHeader } from '../api';
import type { PagedResult } from '@/types/pagination';
import { extractPaginationMeta } from '@/types/pagination';

export interface Session {
  id: string;
  school_id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSessionRequest {
  school_id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export interface UpdateSessionRequest {
  name: string;
  start_date: string;
  end_date: string;
}

export interface SessionResponse {
  success: boolean;
  data: Session | Session[];
  message?: string;
}

interface RawSession {
  id: string;
  school_id: string;
  name: string;
  start_date: string;
  end_date: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

function normalizeSession(session: RawSession): Session {
  return {
    id: session.id,
    school_id: session.school_id,
    name: session.name,
    start_date: session.start_date,
    end_date: session.end_date,
    created_at: session.created_at || session.createdAt,
    updated_at: session.updated_at || session.updatedAt,
  };
}

function extractSessions(payload: any): Session[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const data = payload.data?.data || payload.data || [];

  if (Array.isArray(data)) {
    return data.map(normalizeSession);
  }

  return [];
}

export const getSessionsPage = async (schoolId: string, page: number, limit: number): Promise<PagedResult<Session>> => {
  try {
    const params = new URLSearchParams({ 
      school_id: schoolId,
      page: String(page), 
      limit: String(limit) 
    });
    
    const response = await fetch(`${API_ENDPOINTS.sessions.base()}?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() as Record<string, string> },
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || 'Failed to fetch sessions');
    
    const data = extractSessions(payload);
    const pagination = extractPaginationMeta(payload, data.length);
    return { data, pagination };
  } catch (error) {
    console.error('Get sessions page error:', error);
    throw error;
  }
};

export const getSessionById = async (id: string): Promise<Session> => {
  try {
    const response = await fetch(API_ENDPOINTS.sessions.getById(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader() as Record<string, string>,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch session');
    }

    return normalizeSession(responseData.data);
  } catch (error) {
    console.error('Get Session By ID error:', error);
    throw error;
  }
};

export const createSession = async (data: CreateSessionRequest): Promise<Session> => {
  try {
    const response = await fetch(API_ENDPOINTS.sessions.base(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader() as Record<string, string>,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create session');
    }

    return normalizeSession(responseData.data);
  } catch (error) {
    console.error('Create Session error:', error);
    throw error;
  }
};

export const updateSession = async (id: string, data: UpdateSessionRequest): Promise<Session> => {
  try {
    const response = await fetch(API_ENDPOINTS.sessions.update(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader() as Record<string, string>,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to update session');
    }

    return normalizeSession(responseData.data);
  } catch (error) {
    console.error('Update Session error:', error);
    throw error;
  }
};

export const deleteSession = async (id: string): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINTS.sessions.delete(id), {
      method: 'DELETE',
      headers: {
        ...getAuthHeader() as Record<string, string>,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to delete session');
    }
  } catch (error) {
    console.error('Delete Session error:', error);
    throw error;
  }
};
