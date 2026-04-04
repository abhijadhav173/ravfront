import { ApiClient } from '../client'
import { API_ENDPOINTS } from '../../config/endpoints'
import {
  ContactSubmission,
  WaitlistSubmission,
  ApiResponse,
} from '../../types'

export const publicApi = {
  submitContact: async (data: ContactSubmission): Promise<{ message: string }> => {
    const response = await ApiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.PUBLIC.CONTACT,
      data
    )
    return response.data.data
  },

  submitWaitlist: async (data: WaitlistSubmission): Promise<{ message: string }> => {
    const response = await ApiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.PUBLIC.WAITLIST,
      data
    )
    return response.data.data
  },
}
