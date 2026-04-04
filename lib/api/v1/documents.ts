import { ApiClient } from '../client'
import { API_ENDPOINTS } from '../../config/endpoints'
import {
  Document,
  ApiResponse,
  PaginatedResponse,
} from '../../types'

export interface DocumentUploadData {
  title: string
  category: string
  venture_id?: number
  file: File
  visibility?: string
  requires_signature?: boolean
}

export const documentsApi = {
  // Portal endpoints
  getPortalDocuments: async (
    page: number = 1,
    perPage: number = 10,
    filters?: { category?: string; venture_id?: number }
  ): Promise<PaginatedResponse<Document>> => {
    const response = await ApiClient.get<ApiResponse<PaginatedResponse<Document>>>(
      API_ENDPOINTS.PORTAL.DOCUMENTS,
      { params: { page, per_page: perPage, ...filters } }
    )
    return response.data.data
  },

  downloadDocument: async (id: number): Promise<Blob> => {
    const response = await ApiClient.get<Blob>(
      API_ENDPOINTS.PORTAL.DOCUMENT_DOWNLOAD(id),
      { responseType: 'blob' }
    )
    return response.data
  },

  // Admin endpoints
  getAdminDocuments: async (
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<Document>> => {
    const response = await ApiClient.get<ApiResponse<PaginatedResponse<Document>>>(
      API_ENDPOINTS.ADMIN.DOCUMENTS,
      { params: { page, per_page: perPage } }
    )
    return response.data.data
  },

  uploadDocument: async (data: DocumentUploadData): Promise<Document> => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('category', data.category)
    formData.append('file', data.file)
    if (data.venture_id) formData.append('venture_id', data.venture_id.toString())
    if (data.visibility) formData.append('visibility', data.visibility)
    if (data.requires_signature) formData.append('requires_signature', '1')

    const response = await ApiClient.post<ApiResponse<Document>>(
      API_ENDPOINTS.ADMIN.DOCUMENTS,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data.data
  },

  deleteDocument: async (id: number): Promise<void> => {
    await ApiClient.delete(`${API_ENDPOINTS.ADMIN.DOCUMENTS}/${id}`)
  },
}
