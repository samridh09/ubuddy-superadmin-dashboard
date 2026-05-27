import { API_ENDPOINTS, getAuthHeader } from '../api';

export interface GlobalTerm {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
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
