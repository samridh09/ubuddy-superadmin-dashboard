import { API_ENDPOINTS, handleApiError } from '@/lib/api';
import { fetchWithAuth } from '@/lib/api-client';
import type { PagedResult } from '@/types/pagination';
import { extractPaginationMeta } from '@/types/pagination';
import type {
  Enquiry,
  CreateEnquiryPayload,
  AddVisitPayload,
  AddEnquirerPayload,
  DuplicateCheckResult,
  EnquiryFilters,
  ActionLog,
} from '@/types/enquiry';

const headers = () => ({
  'Content-Type': 'application/json',
});

export const enquiryService = {
  async getAll(filters?: EnquiryFilters): Promise<Enquiry[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.is_starred !== undefined) params.set('is_starred', String(filters.is_starred));
    if (filters?.is_archived !== undefined) params.set('is_archived', String(filters.is_archived));
    if (filters?.search) params.set('search', filters.search);

    const queryStr = params.toString();
    const url = queryStr
      ? `${API_ENDPOINTS.enquiries.base}?${queryStr}`
      : API_ENDPOINTS.enquiries.base;

    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: headers(),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch enquiries');
    }

    const data = await response.json();
    return data.data || data || [];
  },

  async getAllPaginated(filters: EnquiryFilters | undefined, page: number, limit: number): Promise<PagedResult<Enquiry>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.status) params.set('status', filters.status);
    if (filters?.is_starred !== undefined) params.set('is_starred', String(filters.is_starred));
    if (filters?.is_archived !== undefined) params.set('is_archived', String(filters.is_archived));
    if (filters?.search) params.set('search', filters.search);

    const response = await fetchWithAuth(`${API_ENDPOINTS.enquiries.base}?${params}`, {
      method: 'GET',
      headers: headers(),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch enquiries');
    }

    const payload = await response.json();
    const items: Enquiry[] = payload.data?.data || payload.data || payload || [];
    const pagination = extractPaginationMeta(payload, Array.isArray(items) ? items.length : 0);
    return { data: Array.isArray(items) ? items : [], pagination };
  },

  async create(payload: CreateEnquiryPayload): Promise<Enquiry> {
    const response = await fetchWithAuth(API_ENDPOINTS.enquiries.base, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to create enquiry'); }
    const data = await response.json();
    return data.data || data;
  },

  async checkDuplicate(params: Record<string, string>): Promise<DuplicateCheckResult> {
    const queryStr = new URLSearchParams(params).toString();
    const response = await fetchWithAuth(`${API_ENDPOINTS.enquiries.checkDuplicate}?${queryStr}`, {
      method: 'GET',
      headers: headers(),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to check duplicates'); }
    const data = await response.json();
    return data.data || data;
  },

  async getById(id: string): Promise<Enquiry> {
    const response = await fetchWithAuth(API_ENDPOINTS.enquiries.byId(id), {
      method: 'GET',
      headers: headers(),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to fetch enquiry details'); }
    const data = await response.json();
    return data.data || data;
  },

  async update(id: string, payload: Partial<CreateEnquiryPayload>): Promise<Enquiry> {
    const response = await fetchWithAuth(API_ENDPOINTS.enquiries.update(id), {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to update enquiry'); }
    const data = await response.json();
    return data.data || data;
  },

  async updateStatus(id: string, status: string): Promise<Enquiry> {
    const response = await fetchWithAuth(API_ENDPOINTS.enquiries.status(id), {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to update enquiry status'); }
    const data = await response.json();
    return data.data || data;
  },

  async toggleStar(id: string, is_starred: boolean): Promise<Enquiry> {
    const response = await fetchWithAuth(API_ENDPOINTS.enquiries.star(id), {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ is_starred }),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to update starred status'); }
    const data = await response.json();
    return data.data || data;
  },

  async archive(id: string): Promise<Enquiry> {
    const response = await fetchWithAuth(API_ENDPOINTS.enquiries.archive(id), {
      method: 'PATCH',
      headers: headers(),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to archive enquiry'); }
    const data = await response.json();
    return data.data || data;
  },

  async addVisit(id: string, payload: AddVisitPayload): Promise<Enquiry> {
    const response = await fetchWithAuth(API_ENDPOINTS.enquiries.visits(id), {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to add visit'); }
    const data = await response.json();
    return data.data || data;
  },

  async addEnquirer(id: string, payload: AddEnquirerPayload): Promise<Enquiry> {
    const response = await fetchWithAuth(API_ENDPOINTS.enquiries.enquirers(id), {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to add enquirer'); }
    const data = await response.json();
    return data.data || data;
  },

  async updateFollowUp(id: string, date: string, notes?: string): Promise<Enquiry> {
    const response = await fetchWithAuth(API_ENDPOINTS.enquiries.followUp(id), {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ follow_up_date: date, notes }),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to update follow-up date'); }
    const data = await response.json();
    return data.data || data;
  },

  async getActionLogs(id: string): Promise<ActionLog[]> {
    const response = await fetchWithAuth(API_ENDPOINTS.enquiries.logs(id), {
      method: 'GET',
      headers: headers(),
    });

    if (!response.ok) { await handleApiError(response, 'Failed to fetch action logs'); }
    const data = await response.json();
    return data.data || data || [];
  },
};
