import { API_ENDPOINTS, getAuthHeader } from '../api';

export interface GlobalSubject {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  type: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** GET /v1/admin/global-subjects */
export const fetchGlobalSubjects = async (): Promise<GlobalSubject[]> => {
  const res = await fetch(API_ENDPOINTS.globalSubjects.base, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      ...getAuthHeader(),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch subjects');
  return json.data as GlobalSubject[];
};

/** POST /v1/admin/global-subjects */
export const createGlobalSubject = async (name: string): Promise<GlobalSubject> => {
  const res = await fetch(API_ENDPOINTS.globalSubjects.base, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ name }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create subject');
  return json.data as GlobalSubject;
};

/** PUT /v1/admin/global-subjects/:id */
export const updateGlobalSubject = async (id: string, name: string): Promise<GlobalSubject> => {
  const res = await fetch(API_ENDPOINTS.globalSubjects.byId(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ name }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update subject');
  return json.data as GlobalSubject;
};

/** DELETE /v1/admin/global-subjects/:id */
export const deleteGlobalSubject = async (id: string): Promise<void> => {
  const res = await fetch(API_ENDPOINTS.globalSubjects.byId(id), {
    method: 'DELETE',
    headers: {
      Accept: '*/*',
      ...getAuthHeader(),
    },
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || 'Failed to delete subject');
  }
};
