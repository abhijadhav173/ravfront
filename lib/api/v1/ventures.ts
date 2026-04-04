import { ApiClient } from '../client'
import { API_ENDPOINTS } from '../../config/endpoints'
import {
  Venture,
  ApiResponse,
  PaginatedResponse,
} from '../../types'

export const venturesApi = {
  // Public endpoints
  getPublicVentures: async (): Promise<Venture[]> => {
    const response = await ApiClient.get<ApiResponse<Venture[]>>(
      API_ENDPOINTS.PUBLIC.VENTURES
    )
    return response.data.data
  },

  getPublicVentureById: async (id: number): Promise<Venture> => {
    const response = await ApiClient.get<ApiResponse<Venture>>(
      API_ENDPOINTS.PUBLIC.VENTURE_BY_ID(id)
    )
    return response.data.data
  },

  // Portal endpoints (authenticated)
  getPortalVentures: async (page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Venture>> => {
    const response = await ApiClient.get<ApiResponse<PaginatedResponse<Venture>>>(
      API_ENDPOINTS.PORTAL.VENTURES,
      { params: { page, per_page: perPage } }
    )
    return response.data.data
  },

  getPortalVentureById: async (id: number): Promise<Venture> => {
    const response = await ApiClient.get<ApiResponse<Venture>>(
      API_ENDPOINTS.PORTAL.VENTURE_BY_ID(id)
    )
    return response.data.data
  },

  // Admin endpoints
  getAdminVentures: async (page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Venture>> => {
    const response = await ApiClient.get<ApiResponse<PaginatedResponse<Venture>>>(
      API_ENDPOINTS.ADMIN.VENTURES,
      { params: { page, per_page: perPage } }
    )
    return response.data.data
  },

  createVenture: async (data: Partial<Venture>): Promise<Venture> => {
    const response = await ApiClient.post<ApiResponse<Venture>>(
      API_ENDPOINTS.ADMIN.VENTURES,
      data
    )
    return response.data.data
  },

  updateVenture: async (id: number, data: Partial<Venture>): Promise<Venture> => {
    const response = await ApiClient.put<ApiResponse<Venture>>(
      API_ENDPOINTS.ADMIN.VENTURE_BY_ID(id),
      data
    )
    return response.data.data
  },

  deleteVenture: async (id: number): Promise<void> => {
    await ApiClient.delete(API_ENDPOINTS.ADMIN.VENTURE_BY_ID(id))
  },
}
