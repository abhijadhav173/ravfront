/**
 * Form data types
 */

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  password_confirmation: string
  agreed_to_terms: boolean
}

export interface ContactFormData {
  name: string
  email: string
  partner_type: 'co_producer' | 'financier' | 'distributor' | 'operator' | 'creator' | 'other'
  message: string
}

export interface WaitlistFormData {
  name: string
  email: string
  logline?: string
  portfolio_url?: string
}

export interface ConfessionFormData {
  body: string
  category: 'tip' | 'warning' | 'confession' | 'question'
}

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

export interface FormError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: Record<string, string>
  isSubmitting: boolean
  isSuccess: boolean
  errorMessage?: string
}
