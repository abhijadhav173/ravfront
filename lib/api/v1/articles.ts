import { ApiClient } from '../client'
import { API_ENDPOINTS } from '../../config/endpoints'
import {
  Article,
  ApiResponse,
  PaginatedResponse,
} from '../../types'

export interface ArticleFormData {
  title: string
  slug: string
  body: string
  excerpt?: string
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  meta_title?: string
  meta_description?: string
}

export const articlesApi = {
  // Public endpoints
  getPublicArticles: async (
    page: number = 1,
    perPage: number = 10,
    tag?: string
  ): Promise<PaginatedResponse<Article>> => {
    const response = await ApiClient.get<ApiResponse<PaginatedResponse<Article>>>(
      API_ENDPOINTS.PUBLIC.ARTICLES,
      { params: { page, per_page: perPage, tag } }
    )
    return response.data.data
  },

  getArticleBySlug: async (slug: string): Promise<Article> => {
    const response = await ApiClient.get<ApiResponse<Article>>(
      API_ENDPOINTS.PUBLIC.ARTICLE_BY_SLUG(slug)
    )
    return response.data.data
  },

  // Admin endpoints
  getAdminArticles: async (
    page: number = 1,
    perPage: number = 10,
    status?: string
  ): Promise<PaginatedResponse<Article>> => {
    const response = await ApiClient.get<ApiResponse<PaginatedResponse<Article>>>(
      API_ENDPOINTS.ADMIN.ARTICLES,
      { params: { page, per_page: perPage, status } }
    )
    return response.data.data
  },

  createArticle: async (data: ArticleFormData): Promise<Article> => {
    const response = await ApiClient.post<ApiResponse<Article>>(
      API_ENDPOINTS.ADMIN.ARTICLES,
      data
    )
    return response.data.data
  },

  updateArticle: async (id: number, data: Partial<ArticleFormData>): Promise<Article> => {
    const response = await ApiClient.put<ApiResponse<Article>>(
      `${API_ENDPOINTS.ADMIN.ARTICLES}/${id}`,
      data
    )
    return response.data.data
  },

  deleteArticle: async (id: number): Promise<void> => {
    await ApiClient.delete(`${API_ENDPOINTS.ADMIN.ARTICLES}/${id}`)
  },

  publishArticle: async (id: number): Promise<Article> => {
    const response = await ApiClient.put<ApiResponse<Article>>(
      `${API_ENDPOINTS.ADMIN.ARTICLES}/${id}/publish`,
      {}
    )
    return response.data.data
  },
}
