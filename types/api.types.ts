import type { PaginationMeta } from './pagination.types';

export type { PaginationMeta };

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiPaginatedResponse<T = unknown> {
  success?: boolean;
  data: T[];
  meta?: PaginationMeta;
  message?: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
}

