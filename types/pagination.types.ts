export type SortOrder = 'asc' | 'desc';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQueryParams {
  page?: number;
  limit?: number;
  order?: SortOrder;
  search?: string;
  sort_by?: string;
}

/**
 * Utilitas untuk membangun PaginationMeta jika backend mengembalikan raw array atau meta parsial
 */
export function buildPaginationMeta(
  total: number,
  params: { page?: number; limit?: number } = {},
): PaginationMeta {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 10);
  const total_pages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    total_pages,
    has_next: page < total_pages,
    has_prev: page > 1,
  };
}

