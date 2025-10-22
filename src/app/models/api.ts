export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  timestamp?: string;
  path?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface SortOption {
  property: string;
  direction: 'ASC' | 'DESC';
}

export interface PaginationParams {
  page: number;
  size: number;
  sort?: SortOption[];
}

export interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
