export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  requiresAuth?: boolean;
}