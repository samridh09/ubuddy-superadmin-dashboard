import { API_ENDPOINTS, getAuthHeader } from '../api';
import type { PagedResult } from '@/types/pagination';
import { extractPaginationMeta } from '@/types/pagination';

export interface Session {
  id: string;
  school_id: string;
  name?: string;
  start_date: string;
  end_date: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSessionRequest {
  school_id: string;
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
  name?: string;
  start_date: string;
  end_date: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

function isSessionActive(session: Pick<RawSession, 'start_date' | 'end_date' | 'is_active'>): boolean {
  if (typeof session.is_active === 'boolean') {
    return session.is_active;
  }

  const now = Date.now();
  const start = new Date(session.start_date).getTime();
  const end = new Date(session.end_date).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return false;
  }

  return start <= now && now <= end;
}

function normalizeSession(session: RawSession): Session {
  return {
    id: session.id,
    school_id: session.school_id,
    name: session.name,
    start_date: session.start_date,
    end_date: session.end_date,
    is_active: isSessionActive(session),
    created_at: session.created_at || session.createdAt,
    updated_at: session.updated_at || session.updatedAt,
  };
}

function extractSessions(payload: unknown): Session[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const data = record.data ?? payload;

  if (Array.isArray(data)) {
    return data as Session[];
  }

  if (data && typeof data === 'object') {
    const nestedRecord = data as Record<string, unknown>;
    const nestedItems = Array.isArray(nestedRecord.data)
      ? nestedRecord.data
      : Array.isArray(nestedRecord.items)
        ? nestedRecord.items
        : null;

    if (Array.isArray(nestedItems)) {
      return nestedItems.map((item) => normalizeSession(item as RawSession));
    }
  }

  return (Array.isArray(data) ? data : []).map((item) => normalizeSession(item as RawSession));
}

export const getSessionsPage = async (page: number, limit: number, search?: string): Promise<PagedResult<Session>> => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search?.trim()) params.set('search', search.trim());
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

export const getAllSessions = async (): Promise<Session[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.sessions.base(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader() as Record<string, string>,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch sessions');
    }

    return extractSessions(responseData);
  } catch (error) {
    console.error('Get All Sessions error:', error);
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

    return responseData.data as Session;
  } catch (error) {
    console.error('Create Session error:', error);
    throw error;
  }
};
