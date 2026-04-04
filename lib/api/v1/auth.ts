import { ApiClient } from '../client'
import { API_ENDPOINTS } from '../../config/endpoints'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  AuthUser,
  ApiResponse,
} from '../../types/api'

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await ApiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data.data
  },

  register: async (data: RegisterRequest): Promise<AuthUser> => {
    const response = await ApiClient.post<ApiResponse<AuthUser>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    )
    return response.data.data
  },

  logout: async (): Promise<void> => {
    await ApiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    ApiClient.clearAuth()
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await ApiClient.get<ApiResponse<AuthUser>>(
      API_ENDPOINTS.AUTH.USER
    )
    return response.data.data
  },

  resetPassword: async (email: string): Promise<{ message: string }> => {
    const response = await ApiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.PASSWORD_RESET,
      { email }
    )
    return response.data.data
  },
}
