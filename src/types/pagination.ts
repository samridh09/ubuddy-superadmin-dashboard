export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PagedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export const DEFAULT_PAGE_LIMIT = 10;

export function extractPaginationMeta(payload: unknown, itemCount = 0): PaginationMeta {
  const def: PaginationMeta = {
    total: itemCount,
    page: 1,
    limit: DEFAULT_PAGE_LIMIT,
    totalPages: Math.max(1, Math.ceil(itemCount / DEFAULT_PAGE_LIMIT)),
    hasMore: false,
  };

  if (!payload || typeof payload !== 'object') return def;
  const rec = payload as Record<string, unknown>;

  if (typeof rec.total === 'number') {
    return {
      total: rec.total,
      page: Number(rec.page ?? 1),
      limit: Number(rec.limit ?? DEFAULT_PAGE_LIMIT),
      totalPages: Number(rec.totalPages ?? 1),
      hasMore: Boolean(rec.hasMore ?? false),
    };
  }

  if (rec.data && typeof rec.data === 'object' && !Array.isArray(rec.data)) {
    const nested = rec.data as Record<string, unknown>;
    if (typeof nested.total === 'number') {
      return {
        total: nested.total,
        page: Number(nested.page ?? 1),
        limit: Number(nested.limit ?? DEFAULT_PAGE_LIMIT),
        totalPages: Number(nested.totalPages ?? 1),
        hasMore: Boolean(nested.hasMore ?? false),
      };
    }
  }

  return def;
}
