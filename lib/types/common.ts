/**
 * Common types used across the app
 */

export interface PaginationParams {
  page: number
  per_page: number
}

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  status: number
}

export interface SuccessResponse<T> {
  success: true
  data: T
}

export interface ErrorResponse {
  success: false
  error: string
}

export type Result<T> = SuccessResponse<T> | ErrorResponse

export interface ListResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  last_page: number
}

export interface NotificationState {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}
