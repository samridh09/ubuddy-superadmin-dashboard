import { API_ENDPOINTS, getAuthHeader } from '../api';

export interface GlobalTerm {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalTermAssignment {
  assignment_id?: string; // from byClass
  id?: string; // from POST assignment
  class_id: string;
  session_id: string;
  global_term_id?: string; // from POST assignment
  term?: GlobalTerm; // from byClass
  createdAt?: string;
  updatedAt?: string;
}

/** GET /v1/admin/global-terms */
export const fetchGlobalTerms = async (): Promise<GlobalTerm[]> => {
  const res = await fetch(API_ENDPOINTS.globalTerms.base, {
    method: 'GET',
    headers: { Accept: '*/*', ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch terms');
  return json.data as GlobalTerm[];
};

/** POST /v1/admin/global-terms */
export const createGlobalTerm = async (name: string): Promise<GlobalTerm> => {
  const res = await fetch(API_ENDPOINTS.globalTerms.base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: '*/*', ...getAuthHeader() },
    body: JSON.stringify({ name }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create term');
  return json.data as GlobalTerm;
};

/** PUT /v1/admin/global-terms/:id */
export const updateGlobalTerm = async (id: string, name: string): Promise<GlobalTerm> => {
  const res = await fetch(API_ENDPOINTS.globalTerms.byId(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: '*/*', ...getAuthHeader() },
    body: JSON.stringify({ name }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update term');
  return json.data as GlobalTerm;
};

/** DELETE /v1/admin/global-terms/:id */
export const deleteGlobalTerm = async (id: string): Promise<void> => {
  const res = await fetch(API_ENDPOINTS.globalTerms.byId(id), {
    method: 'DELETE',
    headers: { Accept: '*/*', ...getAuthHeader() },
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || 'Failed to delete term');
  }
};

/** POST /v1/admin/global-terms/assignments */
export const assignTermsToClass = async (classId: string, sessionId: string, termIds: string[]): Promise<GlobalTermAssignment[]> => {
  const res = await fetch(API_ENDPOINTS.globalTerms.assignments || `${API_ENDPOINTS.globalTerms.base}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: '*/*', ...getAuthHeader() },
    body: JSON.stringify({
      class_id: classId,
      session_id: sessionId,
      term_ids: termIds,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to assign terms');
  return json.data as GlobalTermAssignment[];
};

/** GET /v1/admin/global-terms/by-class?class_id=X&session_id=Y */
export const getClassAssignedTerms = async (classId: string, sessionId: string): Promise<GlobalTermAssignment[]> => {
  const params = new URLSearchParams({ class_id: classId, session_id: sessionId });
  const res = await fetch(`${API_ENDPOINTS.globalTerms.byClass || `${API_ENDPOINTS.globalTerms.base}/by-class`}?${params}`, {
    method: 'GET',
    headers: { Accept: '*/*', ...getAuthHeader() },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch assigned terms');
  return json.data as GlobalTermAssignment[];
};
